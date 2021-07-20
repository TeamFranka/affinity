import Parse from "parse";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import * as Models from "../db/models";

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localeData);

declare global {
  interface Window {
    PARSE_APP_ID: string;
    PARSE_JS_KEY: string;
    PARSE_URL: string;
    PARSE_LIVE_URL: string | null;
    ANDROID_INSTALL_URL: string;
    IOS_INSTALL_URL: string;
  }
}

Parse.initialize(window.PARSE_APP_ID, window.PARSE_JS_KEY);
Parse.serverURL = window.PARSE_URL;
if (window.PARSE_LIVE_URL) {
  Parse.liveQueryServerURL = window.PARSE_LIVE_URL;
}
// Parse.enableEncryptedUser();
// Parse.enableLocalDatastore();

export const Team = Models.Team;
export const Activity = Models.Activity;
export const Picture = Models.Picture;
export const Comment = Models.Comment;
export const ChatWidgetSettings = Models.ChatWidgetSettings;
export const Conversation = Models.Conversation;
export const Notification = Models.Notification

export const ANDROID_INSTALL_URL = window.ANDROID_INSTALL_URL;
export const IOS_INSTALL_URL = window.IOS_INSTALL_URL;

export enum Verb {
  Post = "post",
  Announce = "announce",
  Comment = "comment",
  Like = "like",
}

export enum Visibility {
  Public = "public",
  Members = "members",
  Mods = "mods",
  Leaders = "leaders",
}

export enum TeamMembershipAccess {
  Open = "open",
  ParentOpen = "parent_open",
  Apply = "apply",
  ParentApply = "parent_apply",
  InviteOnly = "invite_only",
}


export interface ModelT {
  id: string;
}

export { Parse, dayjs };
