
import Parse from 'parse';

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
const ChatWidgetSettings = Parse.Object.extend("ChatWidget");
const Conversation = Parse.Object.extend("Conversation");

export {
    Parse, VERSION, DEFAULT_COMMUNITY,
    // models
    Team, Conversation, ChatWidgetSettings
}