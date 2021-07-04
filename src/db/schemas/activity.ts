import {
  CommonFields, Interactable, ViewTracking, Publishing, Meta
} from "./common";

export const Activity = {
  className: "Activity",
  fields: Object.assign(
    {},
    CommonFields,
    Publishing,
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
      verb: {
        // post, announce, open, close
        type: "String",
        required: true,
      },
      text: {
        // posts are directly on here
        type: "String",
        required: false,
      },
      objects: {
        // any Picture, Polls, etc
        type: "Array",
        required: true,
      },
      extra: {
        // any extra data
        type: "Object",
      },
    },
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
  indexes: {
    verb: {
      verb: 1,
    },
  },
};
