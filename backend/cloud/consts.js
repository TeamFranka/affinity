/* global Parse */

const Activity = Parse.Object.extend("Activity");
const Conversation = Parse.Object.extend("Conversation");
const Comment = Parse.Object.extend("Comment");
const Document = Parse.Object.extend("Document");
const Team = Parse.Object.extend("Team");
const Link = Parse.Object.extend("Link");
const Picture = Parse.Object.extend("Picture");
const Video = Parse.Object.extend("Video");
const User = Parse.User;
const Role = Parse.Role;

const Objects = [
    Activity,
    Document,
    Link,
    Picture,
    Video,
];

module.exports = {
    User: User,
    Role: Role,
    Team: Team,
    Activity: Activity,
    Group: Team, // Legacy Alias
    Conversation: Conversation,
    Document: Document,
    Comment: Comment,
    Link: Link,
    Picture: Picture,
    Video: Video,
    Objects: Objects,
    SLUG_MATCH: /^[a-z0-9-]+$/i,
    UNI_MATCH: /^[a-zA-Z0-9- ]+$/i,
}