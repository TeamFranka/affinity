/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
const Group = CONSTS.Group;
const Conversation = CONSTS.Conversation;

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("newPublicInboxConversation", async (request) => {
  const team = await (new Parse.Query(Group))
    .get(request.params.groupId);
  const user = request.user;
  if (team.get("subOf")) {
    throw "Sub Team Inbox not supported at yet."
  }

  const query = new Parse.Query(Conversation);
  query.equalTo("type", "sharedInbox");
  query.equalTo("team", team);
  query.containsAll("participants", user.get("id"));
  const alreadyThere = await query.first({ useMasterKey: true});
  if (alreadyThere) {
    return alreadyThere
  }

  const newConvo = new Conversation({
    "type": "sharedInbox",
    "team": team,
    "participants": [user.get("id")]
  });

  newConvo.save(null, {useMasterKey: true})

  return newConvo;
},{
  fields : ['groupId'],
  requireUser: true
});

// Ensure the ACL are set correctly when creating
Parse.Cloud.beforeSave("Conversation", async (request) => {
  if (request.original) {
    return // an update not a create, ignore
  }

  if (request.object.get("type") == "sharedInbox") {
    const participants = request.object.get("participants");
    const group = await (new Parse.Query(Group)
      .include("agents")
      .get(request.object.get("team"), { useMasterKey: true }));
    const agents = group.get("agents");
    const user = await (new Parse.Query(Parse.User).get(participants[0]));

    const conversationAcl = new Parse.ACL(user);
    conversationAcl.setRoleReadAccess(agents, true);
    conversationAcl.setRoleWriteAccess(agents, true);
    request.object.setACL(conversationAcl);
  } else {
    throw "Not supported"
  }
});