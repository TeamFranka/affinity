/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const { Team } = require('./team.js');
const Activity = Parse.Object.extend("Activity");
const ChatWidgetSettings = Parse.Object.extend("ChatWidgetSettings");
const Conversation = Parse.Object.extend("Conversation");
const Message = Parse.Object.extend("Message");
const Comment = Parse.Object.extend("Comment");
const Document = Parse.Object.extend("Document");
const Link = Parse.Object.extend("Link");
const Picture = Parse.Object.extend("Picture");
const FaqEntry = Parse.Object.extend("FaqEntry");
const Video = Parse.Object.extend("Video");
const Notification = Parse.Object.extend("Notification");
const Bookmark = Parse.Object.extend("Bookmark");
const User = Parse.User;
const Role = Parse.Role;

const Poll = Parse.Object.extend("Poll", {
    canEdit: function(user, team) {
      if ((this.get("hasVoted") || []).length !== 0) {
          return false
      }
      if (team.isMember("leaders", user.id)) {
        return true;
      }
      return this.get("author").id === user.id;
    }
});

const Objects = [
    FaqEntry,
    Poll,
    Document,
    Link,
    Picture,
    Video,
];

const OGObjects = {
  FaqEntry,
  Poll,
  Document,
  Link,
  Picture,
  Video,
  Team,
  User,
};

module.exports = {
  OGObjects,
  User,
  Role,
  Parse,
  Team,
  Activity,
  ChatWidgetSettings,
  Conversation,
  Document,
  Comment,
  Message,
  Link,
  Poll,
  Picture,
  FaqEntry,
  Video,
  Notification,
  Objects,
  Bookmark,
}