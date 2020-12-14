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
  const userPtr = user.toPointer();
  if (team.get("subOf")) {
    throw "Sub Team Inbox not supported at yet."
  }

  const query = new Parse.Query(Conversation);
  query.equalTo("type", "sharedInbox");
  query.equalTo("team", team);
  query.containsAll("participants", [userPtr]);
  const alreadyThere = await query.first({ useMasterKey: true});
  if (alreadyThere) {
    return alreadyThere
  }

  const newConvo = new Conversation({
    "type": "sharedInbox",
    "team": team,
    "participants": [userPtr]
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
    console.log("in shared");
    const participants = request.object.get("participants");
    console.log("participants", participants, request.object.get("team").id);
    const group = await (new Parse.Query(Group)
      .include("agents")
      .get(request.object.get("team").id, { useMasterKey: true }));
    const agents = group.get("agents");
    console.log("agents", agents);

    const conversationAcl = new Parse.ACL();
    conversationAcl.setRoleReadAccess(agents, true);
    conversationAcl.setRoleWriteAccess(agents, true);
    console.log("set acl");

    participants.forEach((p) => {
      console.log("set acl for ", p, p.id);
      conversationAcl.setReadAccess(p.id, true);
      conversationAcl.setWriteAccess(p.id, true);
    });

    console.log("save acl");
    request.object.setACL(conversationAcl);
  } else {
    throw "Not supported"
  }
});