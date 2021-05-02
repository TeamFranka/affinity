import { CommonFields } from "./common";

export const Bookmark = {
  className: "Bookmark",
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
    },
  ),
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
    },
    count: {
      requiresAuthentication: true,
    },
    get: {
      requiresAuthentication: true,
    },
    create: {
      requiresAuthentication: true,
    },
    update: {},
    delete: {
      requiresAuthentication: true,
    },
    addField: {},
    protectedFields: {},
  },
  indexes: {},
};
