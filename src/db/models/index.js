/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const Activity = Parse.Object.extend("Activity");
const ChatWidgetSettings = Parse.Object.extend("ChatWidgetSettings");
const Conversation = Parse.Object.extend("Conversation");
const Comment = Parse.Object.extend("Comment");
const Poll = Parse.Object.extend("Poll");
const Document = Parse.Object.extend("Document");
const Team = Parse.Object.extend("Team");
const TeamSettings = require('./team-settings').TeamSettings;
const Link = Parse.Object.extend("Link");
const Picture = Parse.Object.extend("Picture");
const Video = Parse.Object.extend("Video");
const User = Parse.User;
const Role = Parse.Role;

const Objects = [
    Activity,
    Poll,
    Document,
    Link,
    Picture,
    Video,
];

module.exports = {
    User: User,
    Role: Role,
    Team: Team,
    TeamSettings: TeamSettings,
    Activity: Activity,
    ChatWidgetSettings: ChatWidgetSettings,
    Conversation: Conversation,
    Document: Document,
    Comment: Comment,
    Link: Link,
    Poll: Poll,
    Picture: Picture,
    Video: Video,
    Objects: Objects,
}