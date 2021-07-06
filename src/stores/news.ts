import { Parse, Activity, Verb } from "@/config/Consts";
import { genFeedState } from "./globals";

const MODEL_KEYS = ["objects", "author", "team"];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NewsT { }

export const News = genFeedState({
  keyword: "news",
  fullQueryFn: (_s: any, teams: any) => new Parse.Query(Activity)
            .equalTo("verb", Verb.Announce)
            .include(MODEL_KEYS)
            .containedIn("team", teams)
            .descending("publishedAt"),
  ignoreTeamSelection: true,
  keys: MODEL_KEYS
});