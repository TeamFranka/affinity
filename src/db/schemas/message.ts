import { CommonFields } from "./common";

export const Message = {
  className: "Message",
  fields: Object.assign({}, CommonFields, {
    conversation: {
      type: "Pointer",
      targetClass: "Conversation",
      required: true,
    },
    author: {
      type: "Pointer",
      targetClass: "_User",
      required: true,
    },
    medium: {
      type: "String",
    },
    text: {
      type: "String",
      required: false,
    },
    objects: {
      // any Picture, Polls...
      type: "Array",
      required: true,
    },
  }),
  classLevelPermissions: {
    find: {
      "*": true,
    },
    count: {
      requiresAuthentication: true,
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
