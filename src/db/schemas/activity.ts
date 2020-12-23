import { CommonFields, Interactable, ViewTracking } from './common';

export const Activity = {
    className: "Activity",
	fields: Object.assign(
        {},
        CommonFields,
        {
            author: {
                type: "Pointer",
                targetClass: "_User",
                required: true
            },
            team: {
                type: "Pointer",
                targetClass: "Team",
                required: true
            },
            verb: { // post, announce, open, close
                type: "String",
                required: true
            },
            text: { // posts are directly on here
                type: "String",
                required: false,
            },
            objects: { // any Post, Picture,
                type: "Array",
                required: true
            },
        },
        Interactable,
        ViewTracking,
    ),
    classLevelPermissions: {
        find: {
            '*': true
        },
        count: {},
        get: {
            '*': true
        },
        create: {
            requiresAuthentication: true
        },
        update: {},
        delete: {},
        addField: {},
        protectedFields: {}
    },
    indexes: {
        verb: {
            verb: 1
        }
    }
}
