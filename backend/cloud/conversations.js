/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
const common = require('./common');
const fetchModel = common.fetchModel;
const Team = CONSTS.Team;
const Conversation = CONSTS.Conversation;
const Message = CONSTS.Message;

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("newPublicInboxConversation", async (request) => {
  const team = await (new Parse.Query(Team))
    .get(request.params.teamId);
  const user = request.user;
  const userPtr = user.toPointer();
  if (team.get("subOf")) {
    throw "Sub Team Inbox not supported at yet."
  }

  const query = new Parse.Query(Conversation);
  query.equalTo("type", "sharedInbox");
  query.equalTo("team", team);
  query.containsAll("participants", [userPtr]);
  let convo = await query.first({ sessionToken: request.user.getSessionToken()});
  if (!convo) {
    convo = new Conversation({
      "type": "sharedInbox",
      "team": team,
      "participants": [userPtr]
    });

    await convo.save(null, {useMasterKey: true});
  }

  if (request.params.message) {
    const newMessage = new Message({
      conversation: convo.toPointer(),
      author: request.user.toPointer(),
      text: request.params.message
    });

    await newMessage.save(null, { sessionToken: request.user.getSessionToken() })

    convo.set("latestMessage", newMessage);
  }

  return convo;
},{
  fields: {
    teamId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    }
  },
  requireUser: true
});

// Ensure the ACL are set correctly when creating
Parse.Cloud.beforeSave("Message", async (request) => {
  if (request.original) {
    throw "Messages can't be edited at the moment"
  }


  const model = request.object;
  const pointer = model.get("conversation");
  const convo = await fetchModel(request, pointer);
  model.set("author", request.user);
  // setting the same ACL
  model.setACL(convo.getACL());

}, {
  requireUser: true
});

// Ensure the ACL are set correctly when creating
Parse.Cloud.afterSave("Message", async (request) => {
  if (request.original) {
    throw "Messages can't be edited at the moment"
  }

  console.log("after", request);

  const pointer = request.object.get("conversation");
  const convo = await fetchModel(request, pointer);

  await convo.save({"latestMessage": request.object}, { useMasterKey: true });

}, {
  requireUser: true
});

// Ensure the ACL are set correctly when creating
Parse.Cloud.beforeSave("Conversation", async (request) => {
  if (request.original) {
    return // an update not a create, ignore
  }

  if (request.object.get("type") == "sharedInbox") {
    const participants = request.object.get("participants");
    const group = await (new Parse.Query(Team)
      .include("agents")
      .get(request.object.get("team").id, { useMasterKey: true }));
    const agents = group.get("agents");

    const conversationAcl = new Parse.ACL();
    conversationAcl.setRoleReadAccess(agents, true);

    participants.forEach((p) => {
      conversationAcl.setReadAccess(p.id, true);
    });

    request.object.setACL(conversationAcl);
  } else if (request.object.get("type") == "team") {
    if (!request.master) {
      throw "Please use masterKey to create team conversations"
    }

  } else {
    throw "Not supported"
  }
});