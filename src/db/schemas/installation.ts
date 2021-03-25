import { CommonFields } from "./common";

export const Installation = {
  className: "_Installation",
  fields: Object.assign({}, CommonFields, {
    installationId: {
      type: "String",
    },
    deviceToken: {
      type: "String",
    },
    channels: {
      type: "Array",
    },
    deviceType: {
      type: "String",
    },
    pushType: {
      type: "String",
    },
    GCMSenderId: {
      type: "String",
    },
    timeZone: {
      type: "String",
    },
    localeIdentifier: {
      type: "String",
    },
    badge: {
      type: "Number",
    },
    appVersion: {
      type: "String",
    },
    appName: {
      type: "String",
    },
    appIdentifier: {
      type: "String",
    },
    parseVersion: {
      type: "String",
    },
    deviceModel: {
      type: "String",
    },
    deviceName: {
      type: "String",
    },
    appBuild: {
      type: "String",
    },
    user: {
      type: "Pointer",
      targetClass: "_User",
    },
  }),
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
    },
    count: {},
    get: {
      "*": true,
    },
    create: {
      "*": true,
    },
    update: {
      "*": true,
    },
    delete: {
      requiresAuthentication: true,
    },
    addField: {},
    protectedFields: {
      "*": [],
    },
  },
  indexes: {},
};
