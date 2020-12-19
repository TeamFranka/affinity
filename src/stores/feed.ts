import { Parse, Post } from "../config/Consts";

export interface FeedT {
  latestPosts: Array<string>;
}

export const Feed = {
  namespaced: true,
  state: () => ({
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
    }
  },
  actions: {
    async refresh(context: any) {
      const teams = context.rootGetters["auth/myTeams"];
      const query = (new Parse.Query(Post))
        .containedIn("team", teams)
        .include("attachments")
        .descending("createdAt");
      const feed = await query.find();

      await context.dispatch("addItems", {key: "attachments", items: feed}, { root: true });
      context.commit("setFeed", feed.map((a) => a.id))

      // const subscription = await query.subscribe();
      // subscription.on('create', async (o) => {
      //   context.commit("addActivities", [o], { root: true });
      //   context.commit("addItem", o.id)
      // });
      // subscription.on('enter', async (o) => {
      //   context.commit("addActivities", [o], { root: true });
      //   context.commit("addItem", o.id)
      // });

      // FIXME: add live query support to stay up to date;
      // https://docs.parseplatform.org/js/guide/#live-queries
    },
  },
};