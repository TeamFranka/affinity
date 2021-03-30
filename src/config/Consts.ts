import Parse from "parse";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import * as Models from "../db/models";

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localeData);

Parse.initialize(
  process.env.VUE_APP_PARSE_APP_ID || "",
  process.env.VUE_APP_PARSE_JS_KEY
);
Parse.serverURL =
  process.env.VUE_APP_PARSE_URL || "http://localhost:1337/parse";
if (process.env.VUE_APP_PARSE_LIVE_URL) {
  Parse.liveQueryServerURL = process.env.VUE_APP_PARSE_LIVE_URL;
}
// Parse.enableEncryptedUser();
// Parse.enableLocalDatastore();

export const VERSION = "0.0.1";
export const DEFAULT_COMMUNITY = process.env.VUE_APP_DEFAULT_TEAM;

export const Team = Models.Team;
export const Activity = Models.Activity;
export const Picture = Models.Picture;
export const Comment = Models.Comment;
export const ChatWidgetSettings = Models.ChatWidgetSettings;
export const Conversation = Models.Conversation;

export const ANDROID_INSTALL_URL =
  "https://install.appcenter.ms/orgs/teamfranka/apps/affinity-live/distribution_groups/public%20beta";
export const IOS_INSTALL_URL =
  "https://install.appcenter.ms/orgs/teamfranka/apps/affinity-live-ios/distribution_groups/public%20beta";

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

export interface ModelT {
  id: string;
}

export { Parse, dayjs };
