// Follow the JSON structure from REST API https://docs.parseplatform.org/rest/guide/#schema
import { CommonFields } from './common';

export const User = {
	className: '_User',
	fields: Object.assign(
        {},
        CommonFields,
        {
            email: { type: 'String' },
            authData: { type: 'Object' },
            password: { type: 'String' },
            username: {
                type: 'String',
                required: true
            },
            name: { type: 'String' },
            avatar: { type: 'File' },
        }),
	indexes: {
        username_1: {
            username: 1
        },
        case_insensitive_username: {
            username: 1
        },
        email_1: {
            email: 1
        },
        case_insensitive_email: {
            email: 1
        }
    },
	classLevelPermissions: {
        find: {
            requiresAuthentication: true
        },
        count: { },
        get: {
            requiresAuthentication: true
        },
        create: {
            '*': true
        },
        update: {},
        delete: {},
        addField: {},
        protectedFields: {
            '*': [
                'email',
                'password'
            ]
        }
    },
}
