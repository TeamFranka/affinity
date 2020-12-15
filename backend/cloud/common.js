/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
const Team = CONSTS.Team;

const setTeamAcl = async (request) => {
    if (!request.original) {
      return // an update not a create, ignore
    }

    // setting author to posting user
    request.object.set("author", request.user);

    const team = await (new Parse.Query(Team)
      .include("members")
      .get(request.object.get("team").id, { useMasterKey: true }));
    const members = team.get("members");
    const newAcl = new Parse.ACL();
    newAcl.setRoleReadAccess(members, true);

    request.object.setAcl(newAcl);
}

module.exports = {
    setTeamAcl: setTeamAcl,
}