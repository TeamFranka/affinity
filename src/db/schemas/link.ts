import { CommonFields, Interactable, ViewTracking, Meta } from "./common";

export const Link = {
  className: "Link",
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
      url: {
        type: "String",
        required: true,
      },
      previewImage: {
        type: "File",
      },
      previewText: {
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
