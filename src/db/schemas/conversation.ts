import { CommonFields } from './common';

export const Conversation = {
    className: "Conversation",
	fields: Object.assign(
        {},
        CommonFields,
        {
            type: {
                type: "String",
                required: true
            },
            medium: {
                type: "String",
            },
            team: {
                type: "Pointer",
                targetClass: "Team",
                required: false
            },
            participants: {
                type: "Array",
                required: true
            },
            latestMesssage: {
                type: "Pointer",
                targetClass: "Message"
            }
        },
    ),
    classLevelPermissions: {
        find: {
            requiresAuthentication: true
        },
        count: {},
        get: {
            requiresAuthentication: true
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