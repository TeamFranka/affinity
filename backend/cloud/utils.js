/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Team } = require("./consts.js");


async function fetchRoles(user) {
  return (await (new Parse.Query(Parse.Role)).equalTo("users", user).find({ useMasterKey: true })) || [];
}

async function fetchRoleIds(user) {
  return (await fetchRoles(user)).map(({ id }) => id);
}

async function fetchMyTeams(user) {
  const roles = await fetchRoles(user);

  const roleIds = roles.map(r => r.id);
  const teams = await ((new Parse.Query(Team))
    .containedIn("members", roles)
    .find({ useMasterKey: true }));

  return { roleIds, teams }
}

async function joinTeam(teamId, user) {
  const sessionToken = user.getSessionToken();
  const team = await (new Parse.Query(Team)).get(teamId, {sessionToken});

  if (!await team.isMember("members", user.id)) {
    // before joining, make sure we are member of their parent, too
    const subOf = team.get("subOf");
    if (subOf) {
      await joinTeam(subOf.id, user);
    }

    await team.applyForMembership(user);
    // need to refresh after becoming a member to ensure we can see the teams we should autojoin
    await team.fetch({sessionToken});

    const autojoinTeams = team.get("autojoin") || [];

    if (autojoinTeams.length > 0) {
      await Promise.all(autojoinTeams.map(async ptr =>
        await joinTeam(ptr.id, user)
      ))
    }
  }
}

module.exports = {
  fetchMyTeams,
  fetchRoleIds,
  fetchRoles,
  joinTeam,
};