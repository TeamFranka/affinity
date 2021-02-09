/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Activity = require("./consts.js").Activity;
const common = require('./common');
const fetchModel = common.fetchModel;
const enforcACL = common.enforcACL;

Parse.Cloud.beforeSave(Activity, async (request) => {
    if (request.original && request.master) {
      return // update of item with master key. let them do it"
    }

    const user = request.user;
    const activity = request.object;
    // making sure the user can see the team
    const team = await fetchModel(request, activity.get("team").toPointer());
    // then pull the other necessary fields
    await team.fetchWithInclude(["members", "publishers", "agents", "mods", "leaders"], {useMasterKey: true})
    const verb = activity.get("verb");

    console.log("can", verb, team);
    if (verb == "post" && team.canDo(user, "canPost")) {
        // is okay
    } else if (verb == "announce" && team.canDo(user, "canPublish")) {
        // also okay
    } else {
        // nope, sorry!
        throw "Sorry, I can't let you do " + verb + ", " + user.username
    }
    console.log("enforcing acl", request, team);
    await enforcACL(request, team);

}, {
    requireUser: true
});

// We want to push news and actiities
Parse.Cloud.afterSave(Activity, async (request) => {
    if (request.original) {
      return // update, let's ignore
    }
    const activity = request.object;
    const team = activity.get("team");
    await team.fetch();
    const verb = activity.get("verb");
    // FIXME: filter visiblity for users

    if (verb == "announce") {
        const title = `News in ${team.get('name')}`;
        const body = team.get("text");
        return Parse.Push.send({
            channels: [`${team.id}:news`],
            notification: { title, body }
        }, { useMasterKey: true });


    } else if (verb == "post" ) {
        const author = activity.get("author");
        await author.fetch();
        const title = `Neuer Beitrag in ${team.get('name')}`;
        const body = `${team.get("author").get("name")|team.get("author").get("username")}: ${team.get("text")}`;

        return Parse.Push.send({
            channels: [`${team.id}:posts`],
            notification: { title, body }
        }, { useMasterKey: true });

    } else {
        console.log("Not pushing", activity);
        return
    }
});
