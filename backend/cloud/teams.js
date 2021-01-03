/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CONSTS = require("./consts.js");
const Team = CONSTS.Team;
const TeamSettings = require("./models/team-settings").TeamSettings;

Parse.Cloud.define("newRootTeam", async (request) => {
  const admin = await (new Parse.Query(Parse.User))
    .get(request.params.admin, { useMasterKey: true });
  if (!admin) throw "Admin not found";
  const query = new Parse.Query(Team);
  query.equalTo("slug", request.params.slug)
  const alreadyThere = await query.first({ useMasterKey: true });
  if (alreadyThere) {
    throw "Slug already in use"
  }

  const newTeam = new Team({
    name: request.params.name,
    slug: request.params.slug,
  });

  await newTeam.save(null, { useMasterKey: true });
  newTeam.get("members").getUsers().add(admin).save(null, { useMasterKey: true });
  newTeam.get("leaders").getUsers().add(admin).save(null, { useMasterKey: true });
  return newTeam

}, {
  fields: {
    name: {
      required: true,
      type: String,
      options: val => {
        return val.length > 7 && !!val.match(CONSTS.UNI_MATCH)
      },
      slug: {
        required: true,
        type: String,
        options: val => {
          return val.length > 7 && !!val.match(CONSTS.SLUG_MATCH)
        },
      },
      admin: {
        required: true,
        type: String,
      }
    },
  },
  validateMasterKey: true,
  requireMaster: true,
});

Parse.Cloud.define("myTeams", async (request) => {
    const user = request.user;
    const roles = await (new Parse.Query(Parse.Role))
        .equalTo("users", user).find({ useMasterKey: true });

    const roleIds = roles.map(r => r.id);
    const teams = await ((new Parse.Query(Team))
        .include("settings")
        .containedIn("members", roles)
        .find({ useMasterKey: true }));

    const permissions = {};
    const cfgDefaults = TeamSettings.getDefaults();

    for (let idx = 0; idx < teams.length; idx++) {
      const team = teams[idx];
      const settings = team.get("settings") || cfgDefaults;
      console.log("settings", settings);
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
        settings.genPermissions(isLeader, isMod, isAgent, isPublisher, true)
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
        .include("settings")
      .first({ useMasterKey: true }));

  const roles = await (new Parse.Query(Parse.Role))
      .equalTo("users", user).find({ useMasterKey: true });

  const roleIds = roles.map(r =>r.id);

  const permissions = {};
  const cfgDefaults = TeamSettings.getDefaults();

  const settings = team.get("settings") || cfgDefaults;
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
    settings.genPermissions(isLeader, isMod, isAgent, isPublisher, isMember)
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



// Ensure the ACL are set correctly when created
Parse.Cloud.beforeSave("Team", async (request) => {
  console.log("starting", request.master);
  if (request.original) {
    return // an update not a create, ignore
  }

  const isRoot = request.master;
  const parentId = request.object.get("subOf");
  let parentTeam = false;
  console.log("starting");
  const acl = new Parse.ACL();
  if (!isRoot) {
      throw "Sorry, only master-key can create new root Level teams."
  // } else if (parentId) {
  //   console.log("parent_id", parentId);
  //   parentTeam = await (new Parse.Query(Team)).get(parentId);
  } else {
    acl.setPublicReadAccess(true);
  }

  // FIXME: parent ACL

  const name = request.object.get("name");

  const leaders = new Parse.Role(name + " Leaders", (new Parse.ACL()));
  leaders.set("type", "leaders");
  if (parentTeam) {
      leaders.getRoles().add(parentTeam.leaders);
  }
  await leaders.save(null, { useMasterKey: true });
  acl.setRoleReadAccess(leaders, true);
  acl.setRoleWriteAccess(leaders, true);
  console.log("mods");
  const mods = new Parse.Role(name + " Mods", (new Parse.ACL()));
  const agents = new Parse.Role(name + " Agents", (new Parse.ACL()));
  const publishers = new Parse.Role(name + " Publishers", (new Parse.ACL()));
  const members = new Parse.Role(name + " Members", (new Parse.ACL()));

  mods.set("type", "mods");
  agents.set("type", "agents");
  publishers.set("type", "publishers");
  members.set("type", "members");

  await mods.save(null, { useMasterKey: true });
  await agents.save(null, { useMasterKey: true });
  await publishers.save(null, { useMasterKey: true });
  await members.save(null, { useMasterKey: true });

  console.log("other")
  // agents.getRoles().add(leaders);
  // publishers.getRoles().add(leaders);
  // mods.getRoles().add(leaders);
  // members.getRoles().add(leaders);

  // console.log("a")
  // const toSave = [mods, agents, publishers, members];
  // await Parse.Object.saveAll(toSave, null, { useMasterKey: true });
  let teamSettings = request.object.get("settings");

  console.log("d")
  if (!teamSettings) {
    teamSettings = new TeamSettings();
    const teamAcl = new Parse.ACL();
    teamAcl.setPublicReadAccess(true);
    //teamAcl.setRoleWriteAccess(members, true);
    teamSettings.setACL(teamAcl);
    await teamSettings.save(null, { useMasterKey: true })
  }

  console.log("w")
  request.object.set({
    "ACL": acl,
    "leaders": leaders,
    "mods": mods,
    "publishers": publishers,
    "agents": agents,
    "members": members,
    "settings": teamSettings,
  });

});