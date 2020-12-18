import { Parse, Activity } from "../config/Consts";

export interface FeedT {
  latest: Array<string>;
}

export const Feed = {
  namespaced: true,
  setup: () => ({
    latest: [],
  }),
  getters: {},
  mutations: {
    setFeed(state: FeedT, items: Array<string>) {
      state.latest = items;
    },
  },
  actions: {
    async refresh(context: any) {
      const teams = context.rootGetters["auth/myTeams"];
      const feed = await (new Parse.Query(Activity))
        .containedIn("verb", ["announce", "post", "pin"])
        .containedIn("team", teams)
        .include("objects")
        .descending("createdAt")
        .find();

      await context.commit("addActivities", feed, { root: true });
      context.commit("setFeed", feed.map((a) => a.id))

      // FIXME: add live query support to stay up to date;
      // https://docs.parseplatform.org/js/guide/#live-queries
    },
  },
};