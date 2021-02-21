/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Team = require("./consts.js").Team;

const CANT_BE_CHANGED = ["team", "author", "ACL"];

const enforcACL = async (request, team) => {
  const visibility = request.object.get("visibility") || "public";
  request.context.visibility = visibility; // keep for later usage
  await team.fetchWithInclude(["leaders", visibility], {useMasterKey: true});
  const leadersRole = team.get("leaders");
  const user = request.user;
  if (!user) throw "User must be set";
  if (!leadersRole) throw "Leaders must be set";
  console.log("checking if leader", user, leadersRole);
  const isLeader = await leadersRole
    .getUsers()
    .query()
    .contains("id", user.id)
    .exists({useMasterKey: true});
  console.log("starting ACL");
  const acl = new Parse.ACL();

  console.log("visibility check:", visibility);

  if (visibility === "public") {
    console.log("making public");
    acl.setPublicReadAccess(true);
  } else if (visibility === "leaders") {
    if (!isLeader) {
      throw "Only team leader can set the role to leaders";
    }
    // this is set anyways.
  } else {
    console.log("checking for role", visibility);
    const role = team.get(visibility);
    if (!role) {
      throw "Unknown visibility "+ visibility
    }
    console.log("checking for user");
    const isMember = await role
      .getUsers()
      .query()
      .contains("id", user.id)
      .exists({useMasterKey: true});

    if (!isLeader && !isMember) {
        throw "Only team leaders and members of the same role can set visibility to it"
    }
    console.log("setting role");
    acl.setRoleReadAccess(role, true);
  }

  console.log("setting admin", leadersRole);
  // Admins can read and write all objects
  acl.setRoleReadAccess(leadersRole, true);
  acl.setRoleWriteAccess(leadersRole, true);

  const whoCanEdit = team.get("canEdit" + request.object.className);
  if (whoCanEdit) {
    console.log("canEdit", whoCanEdit);
    const editGroup = team.get(whoCanEdit);
    if (editGroup) {
      acl.setRoleReadAccess(editGroup, true);
      acl.setRoleWriteAccess(editGroup, true);
    }
  }

  console.log("end");
  // remove the field.
  request.object.unset("visibility");
  // set the ACL
  request.object.setACL(acl);
}

const genericObjectsPreSave = async (request) => {

  const teamId = request.original ? request.original.get("team").id : request.object.get("team").id;
  const team = await (new Parse.Query(Team)
    .include(["members", "mods", "agents", "leaders"])
    .get(teamId, { useMasterKey: true }));

  if (!request.master) {
    const verb = request.original ? 'Edit' : 'Create';

    if (request.object['can' + verb]) {
      // model has custom rules
      if (!request.object['can' + verb](request.user, team)) {
        throw request.user.id + " can't " + verb + " " + request.object.className + " in team " + team.get("name") +  " because model rules disallow that";
      }
    } else if (!team.canDo(request.user, 'can' + verb + request.object.className, team)) {
      throw request.user.id + " can't " + verb + " " + request.object.className + " in team " + team.get("name")
    }
  }

  if (request.original) {
    CANT_BE_CHANGED.forEach(key => {
      request.object.set(key, request.original.get(key));
    });

  } else {
    // setting author to posting user
    if (!request.master) {
      request.object.set("author", request.user);
    }

    await enforcACL(request, team);
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
  enforcACL: enforcACL,
  rejectIfClosed: rejectIfClosed,
  fetchModel: fetchModel,
  genericObjectsPreSave: genericObjectsPreSave,
}