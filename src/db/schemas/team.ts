// Follow the JSON structure from REST API https://docs.parseplatform.org/rest/guide/#schema
import { CommonFields } from "./common";

export const Team = {
  className: "Team",
  fields: Object.assign({}, CommonFields, {
    name: {
      type: "String",
      required: true,
    },
    slug: {
      type: "String",
      required: true,
    },
    leaders: {
      type: "Pointer",
      targetClass: "_Role",
      required: true,
    },
    members: {
      type: "Pointer",
      targetClass: "_Role",
      required: true,
    },
    mods: {
      type: "Pointer",
      targetClass: "_Role",
      required: true,
    },
    agents: {
      type: "Pointer",
      targetClass: "_Role",
      required: true,
    },
    publishers: {
      type: "Pointer",
      targetClass: "_Role",
      required: true,
    },
    subOf: {
      type: "Pointer",
      targetClass: "Team",
      required: false,
    },
    membershipAccess: {
      type: "String",
      required: false,
      // values: open (default), parent_open, apply,  parent_apply, invite,
    },
    avatar: {
      type: "File",
    },
    background: {
      type: "File",
    },
    customStyles: {
      type: "String",
    },
    info: {
      type: "String",
    },
    canPost: {
      type: "String",
    },
    canComment: {
      type: "String",
    },
    canLike: {
      type: "String",
    },
    canCreatePicture: {
      type: "String",
    },
    canCreatePoll: {
      type: "String",
    },
    canCreateLink: {
      type: "String",
    },
    canCreateDocument: {
      type: "String",
    },
    canCreateFaqEntry: {
      type: "String",
    },
    canEditFaqEntry: {
      type: "String",
    },
    socialLinks: {
      type: "Array",
    },
    footerLinks: {
      type: "Array",
    },
  }),
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
