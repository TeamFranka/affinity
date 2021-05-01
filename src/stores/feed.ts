import { Parse, Verb } from "../config/Consts";
import { Activity } from "../db/models";
import { genFeedState } from "./globals";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeedT { }

const MODEL_KEYS = ["objects", "author", "team"];

export const Feed = genFeedState({
  keyword: "feed",
  baseQueryFn: () => new Parse.Query(Activity)
            .containedIn("verb", [Verb.Post, Verb.Announce])
            .include(MODEL_KEYS)
            .descending("createdAt"),
  keys: MODEL_KEYS
});
