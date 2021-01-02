/* global Parse */

const Poll = require('./consts').Poll;
const Activity = require('./consts').Activity;
const common = require('./common');
const fetchModel = common.fetchModel;

Parse.Cloud.define("vote:reset", async (request) => {
  const userId = request.user.id;
  const model = await fetchModel(request, { className: "Poll", objectId: request.params.id});
  common.rejectIfClosed(model);

  if (model.get("isAnonymous")) {
    throw "Vote can't be reset on anonymous votes"
  }

  if (!model.get("allowChange")) {
    throw "Vote is not allowed to be changed"
  }

  const hasVoted = (model.get("hasVoted") || []).filter((x) => x !== userId);

  const votes = {};
  Object.entries(model.get("votes")).forEach( ([key, values]) => {
    const newVals = values.filter((e) => e.userId !== userId);
    if (newVals.length > 0) {
      votes[key] = newVals;
    }
  });

  await model.save({ hasVoted: hasVoted, votes: votes }, { useMasterKey: true});
  return model;
}, {
  fields: {
    id: {
      required: true,
      type: String,
    },
  },
  requireUser: true,
});


Parse.Cloud.define("vote:close", async (request) => {
  const userId = request.user.id;
  const model = await fetchModel(request, { className: "Poll", objectId: request.params.id});
  if (model.get("closedAt")) {
    throw "Poll has already been closed"
  }

  if (model.get("author").id !== userId) {
    throw "Only authors can close a poll"
  }

  const outcome = request.params.outcome;

  await model.save({
    closedAt: (new Date()),
    closedBy: request.user.toPointer(),
    outcome: outcome
  }, { useMasterKey: true});

  // FIXME: post activity that we closed the poll.
  // new Activity({
  //   author: request.user,
  //   team: model.get("team"),
  //   verb: "declare",
  //   objects: [model.toPointer()],
  // }).save(null, {});

  return model;
}, {
  fields: {
    id: {
      required: true,
      type: String,
    },
    outcome: {
      type: String,
      required: false,
    },
  },
  requireUser: true,
});

Parse.Cloud.define("vote", async (request) => {
  const userId = request.user.id;
  const model = await fetchModel(request, { className: "Poll", objectId: request.params.id});
  common.rejectIfClosed(model);

  const hasVoted = model.get("hasVoted") || [];
  const isAnon = model.get("isAnonymous");
  const isMulti = model.get("isMultiselect");

  if (hasVoted.indexOf(userId)  !==  -1) {
    throw "You have already voted. You must reset your vote first"
  }

  if(!isMulti && Object.keys(request.params.votes).length > 1) {
    throw "Sorry, this is a single option poll."
  }

  hasVoted.push(userId);

  const votes = model.get("votes") || {};
  Object.entries(request.params.votes).forEach( ([key, value]) => {
    const current = votes[key] || [];
    const obj = { value: value };
    if (!isAnon) {
      obj["userId"] = userId;
    }
    current.push(obj);
    votes[key] = current;
  });

  await model.save({ hasVoted: hasVoted, votes: votes }, { useMasterKey: true});
  return model;
}, {
  fields: {
    id: {
      required: true,
      type: String,
    },
    votes: {
      required: true,
      type: Object,
    }
  },
  requireUser: true,
});

