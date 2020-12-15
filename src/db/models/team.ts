// Follow the JSON structure from REST API https://docs.parseplatform.org/rest/guide/#schema
import { CommonFields } from './common';

export const Team = {
    className: "Team",
	fields: Object.assign(
        {},
        CommonFields,
        {
            name: {
                type: "String",
                required: true
            },
            slug: {
                type: "String",
                required: true
            },
            avatar: {
                type: 'File'
            },
            leaders: {
                type: "Pointer",
                targetClass: "_Role",
                required: true
            },
            members: {
                type: "Pointer",
                targetClass: "_Role",
                required: true
            },
            mods: {
                type: "Pointer",
                targetClass: "_Role",
                required: true
            },
            agents: {
                type: "Pointer",
                targetClass: "_Role",
                required: true
            },
            publishers: {
                type: "Pointer",
                targetClass: "_Role",
                required: true
            },
            subOf: {
                type: "Pointer",
                targetClass: "Team",
                required: false
            }
        }
    ),
    classLevelPermissions: {
        find: {
            requiresAuthentication: true
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
        slug: {
            slug: 1
        }
    }
}
