/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const Activity = Parse.Object.extend("Activity");
const ChatWidgetSettings = Parse.Object.extend("ChatWidgetSettings");
const Conversation = Parse.Object.extend("Conversation");
const Message = Parse.Object.extend("Message");
const Comment = Parse.Object.extend("Comment");
const Poll = Parse.Object.extend("Poll");
const Document = Parse.Object.extend("Document");
const Team = Parse.Object.extend("Team");
const TeamSettings = require('./team-settings').TeamSettings;
const Link = Parse.Object.extend("Link");
const Picture = Parse.Object.extend("Picture");
const FaqEntry = Parse.Object.extend("FaqEntry");
const Video = Parse.Object.extend("Video");
const User = Parse.User;
const Role = Parse.Role;

const Objects = [
    FaqEntry,
    Poll,
    Document,
    Link,
    Picture,
    Video,
];

module.exports = {
    User: User,
    Role: Role,
    Parse: Parse,
    Team: Team,
    TeamSettings: TeamSettings,
    Activity: Activity,
    ChatWidgetSettings: ChatWidgetSettings,
    Conversation: Conversation,
    Document: Document,
    Comment: Comment,
    Message: Message,
    Link: Link,
    Poll: Poll,
    Picture: Picture,
    FaqEntry: FaqEntry,
    Video: Video,
    Objects: Objects,
}