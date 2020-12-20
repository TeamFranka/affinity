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

const fetchModel = async(request) => {
  const sessionToken = request.headers["x-parse-session-token"];
  const model = await (new Parse.Query(request.params.className))
      .get(request.params.id, {sessionToken: sessionToken});
  return model
}

module.exports = {
  fetchModel: fetchModel,
  setTeamAcl: setTeamAcl,
}