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
            objects: { // any Post, Picture,
                type: "Array",
                required: true
            }
        },
    ),
    classLevelPermissions: {
        find: {
            '*': true
        },
        count: {},
        get: {
            '*': true
        },
        create: {},
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
