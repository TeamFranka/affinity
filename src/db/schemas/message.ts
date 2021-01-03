import { CommonFields } from './common';

export const Message = {
    className: "Message",
	fields: Object.assign(
        {},
        CommonFields,
        {
            conversation: {
                type: "Pointer",
                targetClass: "Conversation",
                required: true
            },
            author: {
                type: "Pointer",
                targetClass: "_User",
                required: true
            },
            medium: {
                type: "String",
            },
            text: {
                type: "String",
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
