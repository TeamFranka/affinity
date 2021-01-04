import { Parse, Verb } from "../config/Consts";
import { Activity, Team } from "../db/models";

export interface FeedT {
  loading: boolean;
  latestPosts: Array<string>;
}

export const Feed = {
  namespaced: true,
  state: () => ({
    loading: true,
    latestPosts: [],
  }),
  getters: {
    latestPosts(state: FeedT, getters: any, rootState: any, rootGetters: any) {
      const objs = rootGetters["objectsMap"];

      return state.latestPosts.map((id) => objs[id])
    }
  },
  mutations: {
    setFeed(state: FeedT, items: Array<string>) {
      state.latestPosts = items;
    },
    addItem(state: FeedT, item: string) {
      state.latestPosts.unshift(item);
    },
    setLoading(state: FeedT, value: boolean) {
      state.loading = value;
    }
  },
  actions: {
    async refresh(context: any) {
      context.commit("setLoading", true);
      const defaultTeam = new Team({id:context.rootGetters["defaultTeamId"]})
      let teams = [defaultTeam];
      if (context.rootGetters["auth/isLoggedIn"]) {
        teams = context.rootGetters["auth/myTeams"];
      }
      console.log("fetching feed for", teams);
      const query = (new Parse.Query(Activity))
        .containedIn("team", teams)
        .containedIn("verb", [Verb.Post, Verb.Announce])
        .include(["objects", "author"])
        .descending("createdAt");
      const feed = await query.find();

      await context.dispatch("addItems", {keys: ["objects", "author"], items: feed}, { root: true });
      context.commit("setFeed", feed.map((a) => a.id))
      context.commit("setLoading", false);

      // FIXME: add live query support to stay up to date;
      // https://docs.parseplatform.org/js/guide/#live-queries
    },
  },
};