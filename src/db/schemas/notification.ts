import { CommonFields } from "./common";

export const Notification = {
  className: "Notification",
  fields: Object.assign({}, CommonFields, {
    for: {
      // who this notification is for
      type: "Pointer",
      targetClass: "_User",
      required: true,
    },
    by: {
      // might be always the case
      type: "Pointer",
      targetClass: "_User",
    },
    verb: {
      // 'liked', 'commented'
      type: "String",
      required: true,
    },
    objects: {
      // any Post, Picture,
      type: "Array",
      required: true,
    },
    specifics: {
      // specifics
      type: "Object",
      required: false,
    },
    seenAt: {
      // has the user seen their notification
      type: "Date",
    },
  }),
  classLevelPermissions: {
    find: {
      pointerFields: ["for"],
    },
    count: {
      pointerFields: ["for"],
    },
    get: {
      pointerFields: ["for"],
    },
    create: {},
    update: {
      pointerFields: ["for"],
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
