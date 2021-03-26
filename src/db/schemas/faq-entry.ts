import { CommonFields, Interactable, ViewTracking } from "./common";

export const FaqEntry = {
  className: "FaqEntry",
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
      image: {
        type: "File",
      },
      text: {
        type: "String",
        required: true,
      },
      tags: {
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
    update: {
      requiresAuthentication: true,
    },
    delete: {},
    addField: {},
    protectedFields: {},
  },
  indexes: {},
};
