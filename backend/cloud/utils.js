/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Team } = require("./consts.js");

async function fetchMyTeams(user) {
  const roles = await (new Parse.Query(Parse.Role))
    .equalTo("users", user).find({ useMasterKey: true });

  const roleIds = roles.map(r => r.id);
  const teams = await ((new Parse.Query(Team))
    .containedIn("members", roles)
    .find({ useMasterKey: true }));

  return { roleIds, teams }
}

module.exports = {
  fetchMyTeams
};