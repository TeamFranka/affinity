import { CommonFields, Interactable, ViewTracking, Meta } from "./common";

export const Video = {
  className: "Video",
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
      previewImage: {
        type: "File",
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
