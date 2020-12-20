/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Team = require("./consts.js").Team;

const setTeamAcl = async (request) => {
    if (request.original) {
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
    // FIXME: well, should depend.
    newAcl.setPublicReadAccess(false);

    console.assert(request.object.setACL(newAcl), "setting ACL failed");
}

module.exports = {
    setTeamAcl: setTeamAcl,
}