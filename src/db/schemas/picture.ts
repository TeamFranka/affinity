import { CommonFields, Interactable, ViewTracking, Meta } from "./common";

export const Picture = {
  className: "Picture",
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
      file: {
        type: "File",
      },
      description: {
        type: "String",
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
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  },
  indexes: {},
};
