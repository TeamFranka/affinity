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
        pointerFields: [
            "author"
        ]
    },
    count: {
        pointerFields: [
            "author"
        ]
    },
    get: {
        pointerFields: [
            "author"
        ]
    },
    create: {
        requiresAuthentication: true
    },
    update: {
        pointerFields: [
            "author"
        ]
    },
    delete: {
        pointerFields: [
            "author"
        ]
    },
  },
  indexes: {},
};
