/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Activity = require("./consts.js").Activity;
const { masterKey } = require("parse");
const common = require('./common');
const fetchModel = common.fetchModel;

Parse.Cloud.beforeSave(Activity, async (request) => {
    if (request.original && request.master) {
      return // update of item with master key. let them do it"
    }

    const user = request.user;
    const context = request.context;
    const activity = request.object;
    console.log(activity, activity.get("team"));
    const team = await fetchModel(request, activity.get("team").toPointer(), ["settings"]);
    console.log("trying to get settings")
    const settings = team.get("settings");
    console.log("settings", settings);
    const verb = activity.get("verb");
    // FIXME: default visibility should be configurable per team;
    const visibility = context.visibility || "public";
    const isLeader = team.get("leaders").getUsers().query().contains("id", user.id).exists({ useMasterKey: true });
    const isMod = team.get("mods").getUsers().query().contains("id", user.id).exists({ useMasterKey: true });
    const isAgent = team.get("agents").getUsers().query().contains("id", user.id).exists({ useMasterKey: true });
    const isPublisher = team.get("publishers").getUsers().query().contains("id", user.id).exists({ useMasterKey: true });
    const isMember = team.get("members").getUsers().query().contains("id", user.id).exists({ useMasterKey: true });

    const permissions = settings.genPermissions(isLeader, isMod, isAgent, isPublisher, isMember);

    if (visibility == "leaders") {
        if (!isLeader) {
            throw "Only team leaders can use leaders-visibility"
        }
        const acl = new Parse.ACL();
        acl.setRoleReadAccess(team.get("leaders"))
        activity.setACL(acl);
    } else if (visibility == "leaders") {
        if (!isLeader && !team.get("mods").getUsers().query().contains("users", user).exists()) {
            throw "Only team leaders and mods can use mods-visibility"
        }
        const acl = new Parse.ACL();
        acl.setRoleReadAccess(team.get("leaders"))
        activity.setACL(acl);
    } else if (visibility == "members") {
        if (!team.get("members").getUsers().query().contains("users", user).exists()) {
            throw "Only members can use members visibility"
        }
        const acl = new Parse.ACL();
        acl.setRoleReadAccess(team.get("members"))
        activity.setACL(acl);
    } else if (visibility == "public") {
        const acl = new Parse.ACL();
        acl.setPublicReadAccess(true)
        activity.setACL(acl);
    } else {
        throw ("Unknown visibility" + visibility);
    }

    // remove the field.
    activity.unset("visibility");

    console.log(verb, permissions);

    if (verb == "post" && permissions.canPost) {
        // is okay
    } else if (verb == "announce" && permissions.canPublish) {
        // also okay
    } else {
        // nope, sorry!
        throw "Sorry, I can't let you do that, " + user.id
    }

}, {
    requireUser: true
});