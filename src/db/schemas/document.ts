import { CommonFields, Interactable, ViewTracking, Meta } from "./common";

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
