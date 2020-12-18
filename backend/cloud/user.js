/* global Parse */

const Team = require("./consts.js").Group;

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("myTeams", async (request) => {
    const user = request.user;
    const roles = await (new Parse.Query(Parse.Role))
        .equalTo("users", user).find({ useMasterKey: true });

    const roleIds = roles.map(r =>r.id);
    const teams = await ((new Parse.Query(Team))
        .containedIn("members", roles).find({ useMasterKey: true }));

    const permissions = {};

    for (let idx = 0; idx < teams.length; idx++) {
        const team = teams[idx];
        if (roleIds.includes(team.get("leaders").id)) {
            permissions[team.id] = {
                "isAdmin": true,
                "canPublish": true,
                "canModerate": true,
                "canPost": true,
                "canComment": true,
                "canLike": true,
            };
            continue
        }

        // FIXME: should be possible to configure via team settings
        const teamPermissions = {
            "canPost": true,
            "canComment": true,
            "canLike": true
        }

        if (roleIds.includes(team.get("mods").id)) {
            teamPermissions["canModerate"] = true;
        }

        if (roleIds.includes(team.get("publishers").id)) {
            teamPermissions["canPublish"] = true;
        }

        permissions[team.id] = teamPermissions;
    }

    return {
        teams: teams,
        permissions: permissions,
    }
},{
  requireUser: true
});