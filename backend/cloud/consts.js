/* global Parse */

const Group = Parse.Object.extend("Team");
const Conversation = Parse.Object.extend("Conversation");
const User = Parse.User;
const Role = Parse.Role;

module.exports = {
    User: User,
    Role: Role,
    Group: Group,
    Conversation: Conversation,
    SLUG_MATCH: /^[a-z0-9-]+$/i,
    UNI_MATCH: /^[a-zA-Z0-9- ]+$/i,
}