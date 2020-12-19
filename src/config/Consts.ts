
import Parse from 'parse';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

Parse.initialize(
    process.env.VUE_APP_PARSE_APP_ID || "",
    process.env.VUE_APP_PARSE_JS_KEY
);
Parse.serverURL = process.env.VUE_APP_PARSE_URL || "http://localhost:1337/parse";
// Parse.enableEncryptedUser();
Parse.enableLocalDatastore();

const VERSION = "0.0.1";
const DEFAULT_COMMUNITY = process.env.VUE_APP_DEFAULT_TEAM;

const Team = Parse.Object.extend("Team");
const Activity = Parse.Object.extend("Activity");
const Picture = Parse.Object.extend("Picture");
const Post = Parse.Object.extend("Post");
const ChatWidgetSettings = Parse.Object.extend("ChatWidget");
const Conversation = Parse.Object.extend("Conversation");

export interface ModelT {
    id: string;
  }

export {
    Parse, dayjs, VERSION, DEFAULT_COMMUNITY,
    // models
    Team, Activity, Picture, Post, Conversation, ChatWidgetSettings
}