/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Team = require("./consts.js").Team;

const CANT_BE_CHANGED = ["team", "author", "ACL"];

const genericObjectsPreSave = async (request) => {

  const teamId = request.original ? request.original.get("team").id : request.object.get("team").id;
  const team = await (new Parse.Query(Team)
    .include(["members", "mods", "agents", "leaders", "settings"])
    .get(teamId, { useMasterKey: true }));
  const settings = team.get("settings");

  if (!request.master) {
    const verb = request.original ? 'Edit' : 'Create';

    if (!settings.canDo(request.user, 'can' + verb + request.object.className, team)) {
      throw request.user.id + " can't " + verb + " " + request.object.className + " in team " + team.get("name")
    }
  }

  if (request.original) {
    CANT_BE_CHANGED.forEach(key => {
      request.object.set(key, request.original.get(key));
    });

  } else {
    // setting author to posting user
    request.object.set("author", request.user);

    const members = team.get("members");
    const newAcl = new Parse.ACL();
    newAcl.setRoleReadAccess(members, true);
    newAcl.setRoleReadAccess(team.get("leaders"), true);
    newAcl.setRoleWriteAccess(team.get("leaders"), true);
    const whoCanEdit = settings.get("canEdit" + request.object.className);
    if (whoCanEdit) {
      const editGroup = team.get(whoCanEdit);
      if (editGroup) {
        newAcl.setRoleReadAccess(editGroup, true);
        newAcl.setRoleWriteAccess(editGroup, true);
      }
    }
    // FIXME: well, should depend.
    newAcl.setPublicReadAccess(false);
    request.object.setACL(newAcl)
  }
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
  console.log('fetching', pointer, request.params, request.context, request.user.getSessionToken());
  return await query.get(pointer ? (pointer.objectId || pointer.id ): request.params.objectId,
          {sessionToken: request.context.sessionToken || request.user.getSessionToken()}
      );
}

module.exports = {
  GenericObjectParams: GenericObjectParams,
  rejectIfClosed: rejectIfClosed,
  fetchModel: fetchModel,
  genericObjectsPreSave: genericObjectsPreSave,
}