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
            titel: {
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
            votes: {
                type: "Object",
                required: false,
            },
            isMultiselect: {
                type: "Boolean",
            },
            isAnonymous: {
                type: "Boolean",
            },
            showResults: {
                type: "Boolean",
            },
            randomizeOrder: {
                type: "Boolean",
            },
            allowChange:  {
                type: "Boolean",
            },
            showsResultsWithoutVote: {
                type: "Boolean",
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
