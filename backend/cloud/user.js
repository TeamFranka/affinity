/* global Parse */
const TEAM_AUTOSIGNUP = "signUpForTeams";
const { joinTeam } = require("./utils.js");

Parse.Cloud.beforeSave(Parse.User, async (request) => {
    if (request.original) {
        return
        // we only care about newly created entries
    }

    const teams = request.object.get(TEAM_AUTOSIGNUP);
    if (teams) {
        request.context[TEAM_AUTOSIGNUP] = teams;
    }
    request.object.unset(TEAM_AUTOSIGNUP);
});

Parse.Cloud.afterSave(Parse.User, async (request) => {

    const teams = request.context[TEAM_AUTOSIGNUP];
    const user = request.object;
    if (teams) {
        await Promise.all(teams.map(async (id) => await joinTeam(id, user)));
    };
});