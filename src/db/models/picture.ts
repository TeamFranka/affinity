import { CommonFields, Interactable, ViewTracking } from './common';

export const Picture = {
    className: "Picture",
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
            file: {
                type: "File",
            },
            description: {
                type: "String",
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
        create: {},
        update: {},
        delete: {},
        addField: {},
        protectedFields: {}
    },
    indexes: {
    }
}
