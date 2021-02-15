/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fetchMyTeams } = require("./utils.js");

Parse.Cloud.beforeSave(Parse.Installation, async (request) => {
  const defaultTeamId = request.object.get("defaultTeamId");
  request.object.unset("defaultTeamId");

  if (!request.master) {
    if (request.user) {
      request.object.set("user", request.user);
    } else {
      request.object.unset("user");
    }
  }

  if (request.original) {
    // an update not a create, ignore startingFollows
    // but let it return the existing set of channels:
    console.log("known");
    request.object.set('channels', request.original.get('channels'));
    return
  }

  const channels = []

  if (request.user) {
    const { teams } = await fetchMyTeams(request.user);
    teams.forEach((x) => {
      channels.push(x.id)
    });
  }

  if (channels.length === 0 && defaultTeamId) {
    channels.push(defaultTeamId);
  }

  request.object.set("channels", channels.map((x) => `${x}:news`));
});