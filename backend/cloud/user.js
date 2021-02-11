/* global Parse */
const TEAM_AUTOSIGNUP = "signUpForTeams";
const { Team } = require('./models');

Parse.Cloud.beforeSave(Parse.User, async (request) => {
    if (request.original) {
        return
        // we only care about newly created entries
    }

    const teams = request.object.get(TEAM_AUTOSIGNUP);
    console.log(teams);
    if (teams) {
        request.context[TEAM_AUTOSIGNUP] = teams;
    }
    console.log(request.context);
    request.object.unset(TEAM_AUTOSIGNUP);
});

Parse.Cloud.afterSave(Parse.User, async (request) => {
    console.log(request.context);
    const teams = request.context[TEAM_AUTOSIGNUP];
    const user = request.object;
    if (teams) {
        for (let t of teams) {
            console.log("asking for", t);
            const team = await (new Parse.Query(Team)).get(t, { useMasterKey: true });
            await team.applyForMembership(user);
        }
    };
});