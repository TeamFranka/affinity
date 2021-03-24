/* eslint-disable @typescript-eslint/camelcase */
export const Role = {
  className: "_Role",
  fields: {
    objectId: {
      type: "String",
    },
    createdAt: {
      type: "Date",
    },
    updatedAt: {
      type: "Date",
    },
    ACL: {
      type: "ACL",
    },
    name: {
      type: "String",
      required: true,
    },
    users: {
      type: "Relation",
      targetClass: "_User",
    },
    roles: {
      type: "Relation",
      targetClass: "_Role",
    },
    type: {
      type: "String",
    },
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
    },
    count: {},
    get: {
      requiresAuthentication: true,
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
  indexes: {
    _id_: {
      _id: 1,
    },
    name_1: {
      name: 1,
    },
  },
};
