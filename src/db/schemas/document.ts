import { CommonFields, Interactable, ViewTracking } from "./common";

export const Document = {
  className: "Document",
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
      siteName: {
        type: "String",
      },
      upload: {
        type: "File",
      },
      url: {
        type: "String",
      },
      description: {
        type: "String",
      },
      metadata: {
        type: "Object",
      },
    },
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
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  },
  indexes: {},
};
