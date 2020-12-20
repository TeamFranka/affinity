import { CommonFields, Interactable, ViewTracking } from './common';

export const Post = {
    className: "Post",
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
            text: {
                type: "String",
            },
            attachments: { // any other object
                type: "Array",
            }
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
    }
}
