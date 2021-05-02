/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fetchMyTeams } = require("./utils.js");
const { Team, Conversation } = CONSTS;

const ROLES = [
  "members",
  "mods",
  "agents",
  "publishers",
  "leaders",
]

async function fetchRoles(user) {
  return await (new Parse.Query(Parse.Role)).equalTo("users", user).find({ useMasterKey: true });
}

function getPermissionsForTeam(roleIds, team) {
  const isMember = roleIds.includes(team.get("members").id);
  const isLeader = roleIds.includes(team.get("leaders").id);
  const isMod = roleIds.includes(team.get("mods").id);
  const isPublisher = roleIds.includes(team.get("publishers").id);
  const isAgent = roleIds.includes(team.get("agents").id);

  return {
    isMember, isLeader, isMod, isPublisher, isAgent,
    ...team.genPermissions(isLeader, isMod, isAgent, isPublisher, isMember),
  };
}

Parse.Cloud.define("getTeams", async (request) => {
  const teams = await ((new Parse.Query(Team)).find({ useMasterKey: true }));
  const roleIds = (await fetchRoles(request.user)).map(({ id }) => id);
  const permissions = Object.assign({}, ...teams.map(team => ({ [team.id]: getPermissionsForTeam(roleIds, team) })));

  return { teams, permissions };
});

async function myTeams(request) {
  const { teams, roleIds } = await fetchMyTeams(request.user);
  const permissions = Object.assign({}, ...teams.map(team => ({ [team.id]: getPermissionsForTeam(roleIds, team) })));

  return { teams, permissions };
}

Parse.Cloud.define("myTeams", myTeams, { requireUser: true });

Parse.Cloud.define("joinTeam", async (request) => {
  console.log("join started");
  const user = request.user;
  const teamId = request.params.teamId;
  const sessionToken = user.getSessionToken();
  const team = await (new Parse.Query(Team)).get(teamId, { sessionToken });
  console.log("3");

  if (!await team.isMember("members", user.id)) {
    console.log("4");
    await team.applyForMembership(user);
  }
  console.log("done");

  return myTeams(request)
}, {
  fields: {
    teamId: {
      required: true,
      type: String,
    },
  },
  requireUser: true
});

Parse.Cloud.define("leaveTeam", async (request) => {
  const user = request.user;
  const teamId = request.params.teamId;
  const sessionToken = user.getSessionToken();
  const team = await (new Parse.Query(Team)).get(teamId, { sessionToken });
  const rolesToUpdate = [];
  for (let index = 0; index < ROLES.length; index++) {
    const role = ROLES[index];
    if (await team.isMember(role, user.id)) {
      const rl = team.get(role);
      rl.getUsers().remove(user);
      rolesToUpdate.push(rl);
    }
  }
  if (rolesToUpdate.length > 0) {
    await Parse.Object.saveAll(rolesToUpdate, { useMasterKey: true });
  }
  return myTeams(request)
}, {
  fields: {
    teamId: {
      required: true,
      type: String,
    },
  },
  requireUser: true
});

Parse.Cloud.define("getTeam", async (request) => {
  const user = request.user;
  const slug = request.params.slug;
  const team = await ((new Parse.Query(Team))
    .equalTo("slug", slug)
    .first(user ? { sessionToken: user.getSessionToken() } : null));

  if (!team) {
    return Promise.reject(Parse.Error.OBJECT_NOT_FOUND)
  }

  const roleIds = fetchRoles(request.user);
  const permissions = { [team.id]: getPermissionsForTeam(roleIds, team) };

  return { teams: [team], permissions };
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
});

Parse.Cloud.define("join", async (request) => {
  const { params, user } = request;
  const teamId = params.teamId;
  const team = await ((new Parse.Query(Team))
    .equalTo("objectId", teamId)
    .first());

  team.members.getUsers().add(user);
  team.members.save();
}, { requireUser: true });

Parse.Cloud.define("leave", async (request) => {
  const { params, user } = request;
  const teamId = params.teamId;
  const team = await ((new Parse.Query(Team))
    .equalTo("objectId", teamId)
    .first());

  team.members.getUsers().remove(user);
  team.members.save();
}, { requireUser: true });


const CANT_BE_CHANGED = [
  "subOf", "slug", "ACL",
  "leaders", "mods", "agents", "publishers", "members"
];

// Ensure the ACL are set correctly when created
Parse.Cloud.beforeSave("Team", async (request) => {
  let user = request.user;
  if (!user && request.master && request.object.get("admin")) {
    user = await (new Parse.Query(Parse.User))
      .get(request.object.get("admin"), { useMasterKey: true });
    request.object.unset("admin");
  }

  const slug = (request.object.get('slug') || "").toLowerCase().trim()
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[\s\W-]+/g, '-')      // Replace spaces, non-word characters and dashes with a single dash (-)
  if (!slug.length) {
    throw "Invalid slug";
  }

  if (request.original) {
    // enforce some fields can't be changed
    const team = request.original;
    if (!request.master && !await team.isMember("leaders", user.id)) {
      throw "Only admins can edit team"
    }
    CANT_BE_CHANGED.forEach(key => {
      if (request.original.get(key) !== request.object.get(key)) {
        request.object.set(key, request.original.get(key));
      }
    });
  } else {
    // not applying an update
    const query = new Parse.Query(Team);
    query.equalTo("slug", slug)
    const alreadyThere = await query.first({ useMasterKey: true });
    if (alreadyThere > 0) {
      throw "Slug already in use"
    }

    // creating,
    const parentTeam = request.object.get("subOf");
    const acl = new Parse.ACL();

    if (!parentTeam && !request.master) {
      throw "Sorry, only master-key can create new root Level teams."
    }

    if (parentTeam) {
      await parentTeam.fetch({ useMasterKey: true });

      if (!request.master && !await parentTeam.isMember("leaders", user.id)) {
        throw "Only admins can create sub teams"
      }

      // FIXME: setting visbility

    } else {
      acl.setPublicReadAccess(true);
    }

    const leaders = new Parse.Role(`${slug} Leaders`, (new Parse.ACL()));
    const members = new Parse.Role(`${slug} Members`, (new Parse.ACL()));
    const mods = new Parse.Role(`${slug} Mods`, (new Parse.ACL()));
    const agents = new Parse.Role(`${slug} Agents`, (new Parse.ACL()));
    const publishers = new Parse.Role(`${slug} Publishers`, (new Parse.ACL()));

    leaders.set("type", "leaders");
    members.set("type", "members");
    mods.set("type", "mods");
    agents.set("type", "agents");
    publishers.set("type", "publishers");

    leaders.getUsers().add(user);
    members.getUsers().add(user);

    await Parse.Object.saveAll([leaders, mods, agents, publishers, members], { useMasterKey: true });

    acl.setRoleReadAccess(members, true);
    acl.setRoleReadAccess(leaders, true);
    acl.setRoleWriteAccess(leaders, true);

    if (parentTeam) {
      const parentLeaders = parentTeam.get('leaders');
      const parentMembers = parentTeam.get('members');
      await Promise.all([parentLeaders.fetch({ useMasterKey: true }), parentMembers.fetch({ useMasterKey: true })]);
      leaders.getRoles().add(parentLeaders);
      await leaders.save(null, { useMasterKey: true });

      acl.setRoleReadAccess(parentMembers, true);
    }

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

const CONVO_TEAMS = ['leaders', 'mods', 'agents', 'publishers'];

// Ensure the ACL are set correctly when created
Parse.Cloud.afterSave("Team", async (request) => {
  if (request.original) {
    return // we don't do anything on an update
  }
  console.log(request.object);
  await request.object.fetchWithInclude(CONVO_TEAMS, { useMasterKey: true });
  // create team internal conversations:
  await Parse.Object.saveAll(CONVO_TEAMS.map((roleName) => {
    const role = request.object.get(roleName);
    const roleType = role.get('type');
    const ACL = new Parse.ACL();
    ACL.setRoleReadAccess(role, true);
    return new Conversation({
      team: request.object,
      type: "team",
      among: roleType,
      participants: [],
      ACL,
    });
  }), { useMasterKey: true });
});