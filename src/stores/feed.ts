import { Parse, Verb } from "../config/Consts";
import { Activity } from "../db/models";
import { Model } from "@/utils/model";
import StateCore from "markdown-it/lib/rules_core/state_core";
import { State } from "ionicons/dist/types/stencil-public-runtime";

const ITEMS_PER_PAGE = 25;

export interface FeedT {
  loading: boolean;
  subscription: any;
  latestPosts: Array<string>;
  query: any;
  currentPos: number;
  total: number;
}

const MODEL_KEYS = ["objects", "author", "team"];

export const Feed = {
  namespaced: true,
  state: () => ({
    loading: true,
    latestPosts: [],
    currentPosition: 0,
  }),
  getters: {
    latestPosts(state: FeedT, getters: any, rootState: any, rootGetters: any): Model[] {
      const objs = rootGetters["objectsMap"];

      return state.latestPosts.map((id) => objs[id])
    },
    canLoadMore(state: FeedT): boolean {
      if (state.loading) return false;
      return state.currentPos < state.total;
    },
  },
  mutations: {
    addToFeed(state: FeedT, items: any) {
      const { feed, total } = items;
      state.total = total;
      state.currentPos += feed.length;
      state.latestPosts = state.latestPosts.concat(feed);
    },
    addItem(state: FeedT, item: string) {
      state.latestPosts.unshift(item);
      state.currentPos += 1;
      state.total += 1;
    },
    rmItem(state: FeedT, item: string) {
      state.latestPosts = state.latestPosts.filter((x) => x !== item);
      state.currentPos -= 1;
      state.total -= 1;
    },
    setLoading(state: FeedT, value: boolean) {
      state.loading = value;
    },
  },
  actions: {
    async loadMore(context: any) {
      if (!context.getters.canLoadMore) {
        return
      }
      context.commit("setLoading", true);
      const query = (new Parse.Query(Activity) as any).fromJSON(context.state.query);
      query.skip(context.state.currentPos);
      query.limit(ITEMS_PER_PAGE);
      const feed = await query.find();
      await context.dispatch("addItems", feed);
      context.commit("setLoading", false);
    },
    async addItems(context: any, result: any) {
      const {results, total} = result;
      await context.dispatch("addItems", {keys: MODEL_KEYS, items: results}, { root: true });
      await context.commit("addToFeed", {feed: results.map((a: Parse.Object) => a.id), total});
    },
    async refresh(context: any) {
      context.commit("setLoading", true);
      context.dispatch("unsubscribe", 'feed', {root: true});
      const teams = context.rootGetters["auth/teamPointers"];
      const query = (new Parse.Query(Activity))
        .containedIn("team", teams)
        .containedIn("verb", [Verb.Post, Verb.Announce])
        .include(MODEL_KEYS)
        .limit(ITEMS_PER_PAGE)
        .descending("createdAt");
      // FIXME workaround until merged https://github.com/DefinitelyTyped/DefinitelyTyped/pull/51711
      (query as any).withCount(true);
      context.commit("setQuery", query.toJSON())
      const feed = await query.find();
      await context.dispatch("addItems", feed);


      context.dispatch("subscribe", {
        id: 'feed', keys: MODEL_KEYS, query, addCb: "feed/addItem", rmCb: "rmItem"
      }, {root: true});
      context.commit("setLoading", false);
    },
  },
};