import { CommonFields, Interactable, ViewTracking, Closable } from './common';

export const Poll = {
    className: "Poll",
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
            text: {
                type: "String",
                required: false,
            },
            options: {
                type: "Array",
                required: true
            },
            hasVoted: {
                type: "Array",
            },
            votes: {
                type: "Object",
                required: false,
            },
            outcome: {
                type: "String",
                required: false,
            },
            isMultiselect: {
                type: "Boolean",
                default: false,
            },
            isAnonymous: {
                type: "Boolean",
                default: false,
            },
            showResults: {
                type: "Boolean",
                default: false,
            },
            randomizeOrder: {
                type: "Boolean",
                default: false,
            },
            allowChange:  {
                type: "Boolean",
                default: false,
            },
            showsResultsWithoutVote: {
                type: "Boolean",
                default: false,
            },
        },
        Closable,
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
}
