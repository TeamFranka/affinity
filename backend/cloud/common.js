/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Team = require("./consts.js").Team;

const setTeamAcl = async (request) => {
    if (request.original) {
      return // an update not a create, ignore
    }

    const team = await (new Parse.Query(Team)
      .include(["members", "mods", "agents", "leaders", "settings"])
      .get(request.object.get("team").id, { useMasterKey: true }));

    if (!team.get("settings").canDo(request.user, 'canCreate' + request.object.className, team)) {
      throw request.user.id + " can't create " + request.object.className + " in team " + team.get("name")
    }

    // setting author to posting user
    request.object.set("author", request.user);

    const members = team.get("members");
    const newAcl = new Parse.ACL();
    newAcl.setRoleReadAccess(members, true);
    // FIXME: well, should depend.
    newAcl.setPublicReadAccess(false);

    console.assert(request.object.setACL(newAcl), "setting ACL failed");
}

function rejectIfClosed(model) {
  if (model.get("closedAt")) {
    throw "Rejected" + model.className + " " + model.id + " already closed."
  }
  const willCloseAt = model.get("closesAt");
  const now = new Date();
  if (willCloseAt && willCloseAt <= now) {
    throw "Rejected" + model.className + " " + model.id + " is closed."
  }
}

const GenericObjectParams = {
  fields: {
    className: {
      required: true,
      type: String,
    },
    objectId: {
      required: true,
      type: String,
    }
  },
  requireUser: true
}

const fetchModel = async(request, pointer, includes) => {
  const query = new Parse.Query(pointer ? pointer.className : request.params.className);
  if (includes) {
    includes.forEach((i) => query.include(i))
  }
  return await query.get(pointer ? pointer.objectId : request.params.objectId,
          {sessionToken: request.user.getSessionToken()}
      );
}

module.exports = {
  GenericObjectParams: GenericObjectParams,
  rejectIfClosed: rejectIfClosed,
  fetchModel: fetchModel,
  setTeamAcl: setTeamAcl,
}