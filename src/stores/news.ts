import { Parse, Activity, Verb } from "../config/Consts";
import { Feed } from "./globals";

const MODEL_KEYS = ["objects", "team"];
const FEED_ID = "news"
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NewsT {

}

export const News = {
  namespaced: true,
  getters: {
    feed(
      state: NewsT,
      getters: any,
      rootState: any,
      rootGetters: any
    ): Feed | null {
      return rootGetters.feeds[FEED_ID];
    },
    loading(state: NewsT, getters: any): boolean {
      return getters.feed?.loading;
    },
    latest(state: NewsT, getters: any): Array<string> {
      return getters.feed?.entries;
    },
  },
  mutations: { },
  actions: {
    async refresh(context: any) {
      const teams = context.rootGetters["auth/teamPointers"];
      const query = new Parse.Query(Activity)
        .equalTo("verb", Verb.Announce)
        .containedIn("team", teams)
        .include(MODEL_KEYS)
        .descending("createdAt");
      await context.dispatch(
        "queryFeed",
        {
          id: FEED_ID,
          keys: MODEL_KEYS,
          query,
        },
        { root: true }
      );
    },
  },
};
