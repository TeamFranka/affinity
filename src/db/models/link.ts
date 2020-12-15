import { CommonFields, Interactable, ViewTracking } from './common';

export const Link = {
    className: "Link",
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
            title: {
                type: "String",
                required: true
            },
            url: {
                type: "String",
                required: true
            },
            previewImage: {
                type: "File",
            },
            previewText: {
                type: "String",
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
        create: {},
        update: {},
        delete: {},
        addField: {},
        protectedFields: {}
    },
    indexes: {
    }
}
