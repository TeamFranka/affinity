/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Activity, Bookmark } = require("./consts.js");
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
    await team.fetchWithInclude(["members", "publishers", "agents", "mods", "leaders"], {useMasterKey: true});

    if (request.original) {
        // only admin may update for now
        if (!await team.isMember("leaders", user.id)) {
            throw "Only Team Admins can update posts at the moment"
        }
        return
    }

    const verb = activity.get("verb");

    if (verb == "post" && await team.canDo(user, "canPost")) {
        // is okay
    } else if (verb == "announce" && await team.canDo(user, "canPublish")) {
        // also okay
    } else {
        // nope, sorry!
        throw "Sorry, I can't let you do " + verb + ", " + user.username
    }

    await enforcACL(request, team);

}, {
    requireUser: true
});

Parse.Cloud.afterFind(Activity, async (request) => {
    if (request.user) {
        const ids = request.objects.map(model => model.id);
        const bookmarks = {};
        (await (new Parse.Query(Bookmark))
            .equalTo("author", request.user)
            .equalTo("on.className", "Activity")
            .containedBy("on.objectId", ids)
            .find({sessionToken: request.user.getSessionToken()})
        ).map((b) => {
            bookmarks[b.get("on").objectId] = true;
        })

        request.objects.forEach((x) => {
            x.set("bookmarked", !!bookmarks[x.id])
        })
    }
    return Promise.resolve(request.objects)
})


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
//
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

//

//     return Parse.Push.send(message, { useMasterKey: true });
// });
