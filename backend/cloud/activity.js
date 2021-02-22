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

// const CHANNELS_MAP = {'announce': 'news', 'post': 'posts'};
// // We want to push news and actiities
// Parse.Cloud.afterSave(Activity, async (request) => {
//     if (request.original) {
//       return // update, let's ignore
//     }
//     const activity = request.object;
//     const team = activity.get("team");
//     await team.fetch();
//     const verb = activity.get("verb");

//     const notification = {};
//     const data = {
//         "urlTarget": {
//             name: 'ViewActivity',
//             params: {
//                 activityId: activity.id
//             }
//         }
//     };

//     if (verb == "announce") {
//         notification.tag = `${team.id}:news`;
//         notification.title = `News in ${team.get('name')}`;
//         notification.body = activity.get("text");
//         const body = activity.get("text");
//         if (body) {
//             notification.body = body;
//         }
//     } else if (verb == "post" ) {
//         notification.tag = `${team.id}:posts`;
//         notification.title = `Neuer Beitrag in ${team.get('name')}`;
//         const body = activity.get("text");
//         if (body) {
//             const author = activity.get("author");
//             await author.fetch();
//             const username = author.get("name") || author.get("username");
//             notification.body = `${username}: ${body}`;
//         }
//     } else {
//         console.log("Not pushing", activity);
//         return
//     }

//     if (!notification.image) {
//         for (const o of activity.get("objects")) {
//             if (o.className == "Picture") {
//                 await o.fetch();
//                 notification.image = o.get("file").url()
//                 break;
//             }
//         }
//     }

//     if (!notification.image) {
//         const teamAvatar = team.get("avatar");
//         if (teamAvatar) {
//             notification.image = teamAvatar.url();
//         }
//     }

//     const visibility = request.context.visibility;
//     const message = { notification, data };
//     const channel = `${team.id}:${CHANNELS_MAP[verb]}`;
//     if (visibility == "public") {
//         message.channels = channel;
//     } else {
//         const targetMembers = team.get(visibility);
//         await targetMembers.fetch({useMasterKey: true});
//         const query = new Parse.Query(Parse.Installation)
//         query.equalTo('channels', channel)
//         query.matchesQuery('user', targetMembers.getUsers().query())
//         message.where = query;
//     }

//     console.log("sending push notification", message);

//     return Parse.Push.send(message, { useMasterKey: true });
// });
