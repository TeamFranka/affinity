import { CommonFields, Interactable, ViewTracking } from "./common";

export const Comment = {
  className: "Comment",
  fields: Object.assign(
    {},
    CommonFields,
    {
      author: {
        type: "Pointer",
        targetClass: "_User",
        required: true,
      },
      on: {
        type: "Object",
        required: true,
      },
      replyTo: {
        type: "Pointer",
        targetClass: "Comment",
      },
      text: {
        type: "String",
        required: true,
      },
      attachments: {
        // any other object
        type: "Array",
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
