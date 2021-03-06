import { CommonFields, Interactable, ViewTracking, Closable, Meta } from "./common";

export const Poll = {
  className: "Poll",
  fields: Object.assign(
    {},
    CommonFields,
    {
      author: {
        type: "Pointer",
        targetClass: "_User",
        required: true,
      },
      team: {
        type: "Pointer",
        targetClass: "Team",
        required: true,
      },
      title: {
        type: "String",
        required: true,
      },
      text: {
        type: "String",
        required: false,
      },
      options: {
        type: "Array",
        required: true,
      },
      hasVoted: {
        type: "Array",
      },
      votes: {
        type: "Object",
      },
      outcome: {
        type: "String",
      },
      isMultiselect: {
        type: "Boolean",
      },
      isAnonymous: {
        type: "Boolean",
      },
      showResults: {
        type: "Boolean",
      },
      randomizeOrder: {
        type: "Boolean",
      },
      allowChange: {
        type: "Boolean",
      },
      showsResultsWithoutVote: {
        type: "Boolean",
      },
    },
    Closable,
    Interactable,
    ViewTracking,
    Meta,
  ),
  classLevelPermissions: {
    find: {
      "*": true,
    },
    count: {
      "*": true,
    },
    get: {
      "*": true,
    },
    create: {
      requiresAuthentication: true,
    },
    update: {
      requiresAuthentication: true,
    },
    delete: {},
    addField: {},
    protectedFields: {},
  },
};
