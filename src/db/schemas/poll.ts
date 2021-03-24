import { CommonFields, Interactable, ViewTracking, Closable } from "./common";

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
    ViewTracking
  ),
  classLevelPermissions: {
    find: {
      "*": true,
    },
    count: {},
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
