// Follow the JSON structure from REST API https://docs.parseplatform.org/rest/guide/#schema
export const User = {
	className: '_User',
	fields: {
		objectId: { type: 'String' },
		createdAt: {
			type: 'Date',
		},
		updatedAt: {
			type: 'Date',
		},
		ACL: { type: 'ACL' },
		email: { type: 'String' },
		authData: { type: 'Object' },
		password: { type: 'String' },
		username: { type: 'String' },
		name: { type: 'String' },
		avatar: { type: 'File' },
	},
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
        count: {
            requiresAuthentication: true
        },
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
