import { Parse, Verb } from "../config/Consts";
import { Activity, Team } from "../db/models";

export interface FeedT {
  loading: boolean;
  subscription: any;
  latestPosts: Array<string>;
}

const MODEL_KEYS = ["objects", "author"];

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
    rmItem(state: FeedT, item: string) {
      state.latestPosts = state.latestPosts.filter((x) => x !== item);
    },
    setLoading(state: FeedT, value: boolean) {
      state.loading = value;
    },
  },
  actions: {
    async refresh(context: any) {
      context.commit("setLoading", true);
      context.dispatch("unsubscribe", 'feed', {root: true});
      const defaultTeam = new Team({id:context.rootGetters["defaultTeamId"]})
      let teams = [defaultTeam];
      if (context.rootGetters["auth/isLoggedIn"]) {
        teams = context.rootGetters["auth/myTeams"];
      }
      console.log("fetching feed for", teams);
      const query = (new Parse.Query(Activity))
        .containedIn("team", teams)
        .containedIn("verb", [Verb.Post, Verb.Announce])
        .include(MODEL_KEYS)
        .descending("createdAt");
      const feed = await query.find();

      await context.dispatch("addItems", {keys: MODEL_KEYS, items: feed}, { root: true });
      context.commit("setFeed", feed.map((a) => a.id))
      context.dispatch("subscribe", {
        id: 'feed', keys: MODEL_KEYS, query, addCb: "feed/addItem", rmCb: "rmItem"
      }, {root: true});
      context.commit("setLoading", false);
    },
  },
};