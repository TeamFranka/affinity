/* global Parse */

const Consts = require("./consts.js");
const Team = Consts.Team;
const TeamSettings = require("./models/team-settings").TeamSettings;

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("myTeams", async (request) => {
    const user = request.user;
    const roles = await (new Parse.Query(Parse.Role))
        .equalTo("users", user).find({ useMasterKey: true });

    const roleIds = roles.map(r =>r.id);
    const teams = await ((new Parse.Query(Team))
        .include("settings")
        .containedIn("members", roles)
        .find({ useMasterKey: true }));

    const permissions = {};
    const cfgDefaults = TeamSettings.getDefaults();

    for (let idx = 0; idx < teams.length; idx++) {
        const team = teams[idx];
        const settings = team.get("settings") || cfgDefaults;

        permissions[team.id] = settings.genPermissions(
            roleIds.includes(team.get("leaders").id),
            roleIds.includes(team.get("mods").id),
            roleIds.includes(team.get("agents").id),
            true, // members
        )
    }

    return {
        teams: teams,
        permissions: permissions,
    }
},{
  requireUser: true
});