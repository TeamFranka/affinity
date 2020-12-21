
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

export const VERSION = "0.0.1";
export const DEFAULT_COMMUNITY = process.env.VUE_APP_DEFAULT_TEAM;

export const Team = Parse.Object.extend("Team");
export const Activity = Parse.Object.extend("Activity");
export const Picture = Parse.Object.extend("Picture");
export const Comment = Parse.Object.extend("Comment");
export const ChatWidgetSettings = Parse.Object.extend("ChatWidget");
export const Conversation = Parse.Object.extend("Conversation");

export enum Verb {
    Post = "post",
    Announce = "announce",
}

export interface ModelT {
    id: string;
  }

export {
    Parse, dayjs,
}