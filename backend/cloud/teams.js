/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
const Team = CONSTS.Team;

Parse.Cloud.define("myTeams", async (request) => {
    const user = request.user;
    const roles = await (new Parse.Query(Parse.Role))
        .equalTo("users", user).find({ useMasterKey: true });

    const roleIds = roles.map(r => r.id);
    const teams = await ((new Parse.Query(Team))
        .containedIn("members", roles)
        .find({ useMasterKey: true }));

    const permissions = {};

    for (let idx = 0; idx < teams.length; idx++) {
      const team = teams[idx];
      const isLeader = roleIds.includes(team.get("leaders").id);
      const isMod = roleIds.includes(team.get("mods").id);
      const isPublisher = roleIds.includes(team.get("publishers").id);
      const isAgent = roleIds.includes(team.get("agents").id);

      permissions[team.id] = Object.assign({
          isMember: true,
          isLeader: isLeader,
          isMod: isMod,
          isPublisher: isPublisher,
          isAgent: isAgent,
        },
        team.genPermissions(isLeader, isMod, isAgent, isPublisher, true)
      );
    }

    return {
      teams: teams,
      permissions: permissions,
    }
}, {
  requireUser: true
});


Parse.Cloud.define("getTeam", async (request) => {
  const user = request.user;
  const slug = request.params.slug;
  const team = await ((new Parse.Query(Team))
        .equalTo("slug", slug)
      .first({ useMasterKey: true }));

  const roles = await (new Parse.Query(Parse.Role))
      .equalTo("users", user).find({ useMasterKey: true });

  const roleIds = roles.map(r =>r.id);

  const permissions = {};

  const isMember = roleIds.includes(team.get("members").id);
  const isLeader = roleIds.includes(team.get("leaders").id);
  const isMod = roleIds.includes(team.get("mods").id);
  const isPublisher = roleIds.includes(team.get("publishers").id);
  const isAgent = roleIds.includes(team.get("agents").id);
  permissions[team.id] = Object.assign({
      isMember: isMember,
      isLeader: isLeader,
      isMod: isMod,
      isPublisher: isPublisher,
      isAgent: isAgent,
    },
    team.genPermissions(isLeader, isMod, isAgent, isPublisher, isMember)
  );

  return {
    teams: [team],
    permissions: permissions,
  }

}, {
  fields: {
    slug: {
      required: true,
      type: String,
      options: val => {
        return val.length > 7 && !!val.match(CONSTS.SLUG_MATCH)
      },
    },
  },
  requireUser: true,
});


const CANT_BE_CHANGED = [
  "subOf", "slug", "ACL",
  "leaders", "mods", "agents", "publishers", "members"
];

// Ensure the ACL are set correctly when created
Parse.Cloud.beforeSave("Team", async (request) => {
  console.log("starting", request.master);
  let user = request.user;
  if (!user && request.master && request.object.get("admin")){
    user = await (new Parse.Query(Parse.User))
      .get(request.object.get("admin"), { useMasterKey:true });
    request.object.unset("admin");
  }
  const name = request.object.get("name");

  if (request.original) {
    // enforce some fields can't be changed
    const team = request.original;
    if (!request.master && !team.isMember("leaders", user.id)) {
      throw "Only admins can edit team"
    }
    CANT_BE_CHANGED.forEach(key => {
      if (request.original.get(key) !== request.object.get(key)) {
        request.object.set(key, request.original.get(key));
      }
    });
  } else {

    const query = new Parse.Query(Team);
    query.equalTo("slug", request.object.get('slug'))
    const alreadyThere = await query.first({ useMasterKey: true });
    if (alreadyThere) {
      throw "Slug already in use"
    }

    // creating,
    const parentId = request.object.get("subOf");
    const acl = new Parse.ACL();

    let parentTeam = false;

    if (!parentId && !request.master) {
      throw "Sorry, only master-key can create new root Level teams."
    }

    if (parentId) {
      console.log("parentId", parentId);
      parentTeam = await (new Parse.Query(Team))
        .get(parentId, { useMasterKey: true });

      if (!parentTeam.isMember("leaders", user.id)) {
        throw "Only admins can create sub teams"
      }

      // FIXME: setting visbility

    } else {
      acl.setPublicReadAccess(true);
    }

    // creating the roles
    const leaders = new Parse.Role(name + " Leaders", (new Parse.ACL()));
    leaders.set("type", "leaders");
    leaders.getUsers().add(user);

    if (parentTeam) {
        leaders.getRoles().add(parentTeam.leaders);
    }
    await leaders.save(null, { useMasterKey: true });

    acl.setRoleReadAccess(leaders, true);
    acl.setRoleWriteAccess(leaders, true);
    const mods = new Parse.Role(name + " Mods", (new Parse.ACL()));
    const agents = new Parse.Role(name + " Agents", (new Parse.ACL()));
    const publishers = new Parse.Role(name + " Publishers", (new Parse.ACL()));
    const members = new Parse.Role(name + " Members", (new Parse.ACL()));

    mods.set("type", "mods");
    agents.set("type", "agents");
    publishers.set("type", "publishers");
    members.set("type", "members");

    members.getUsers().add(user);

    // FIXME: can we just add them and have them created in one go instead?
    await mods.save(null, { useMasterKey: true });
    await agents.save(null, { useMasterKey: true });
    await publishers.save(null, { useMasterKey: true });
    await members.save(null, { useMasterKey: true });

    request.object.set({
      "ACL": acl,
      "leaders": leaders,
      "mods": mods,
      "publishers": publishers,
      "agents": agents,
      "members": members,
    });
  }
});