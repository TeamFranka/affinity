import { Parse } from "../config/Consts";
import { Picture } from "../db/models";
import { Model } from "@/utils/model";

const ITEMS_PER_PAGE = 25;

export interface GalleryT {
  loading: boolean;
  subscription: any;
  latestPicture: Array<string>;
  query: any;
  currentPos: number;
  total: number;
}

const MODEL_KEYS = ["objects", "author", "team"];

export const Gallery = {
  namespaced: true,
  state: () => ({
    loading: true,
    latestPicture: [],
    currentPos: 0,
    total: 0,
  }),
  getters: {
    latest(state: GalleryT, getters: any, rootState: any, rootGetters: any): Model[] {
      const objs = rootGetters["objectsMap"];

      return state.latestPicture.map((id) => objs[id])
    },
    canLoadMore(state: GalleryT): boolean {
      if (state.loading) return false;
      return state.currentPos < state.total;
    },
  },
  mutations: {
    addToFeed(state: GalleryT, items: any) {
      const { feed, total } = items;
      state.total = total;
      state.currentPos += feed.length;
      state.latestPicture = state.latestPicture.concat(feed);
    },
    setQuery(state: GalleryT, query: any) {
      state.query = query
    },
    addItem(state: GalleryT, item: string) {
      state.latestPicture.unshift(item);
      state.currentPos += 1;
      state.total += 1;
    },
    rmItem(state: GalleryT, item: string) {
      state.latestPicture = state.latestPicture.filter((x) => x !== item);
      state.currentPos -= 1;
      state.total -= 1;
    },
    setLoading(state: GalleryT, value: boolean) {
      state.loading = value;
    },
  },
  actions: {
    async loadMore(context: any) {
      if (!context.getters.canLoadMore) {
        return
      }
      context.commit("setLoading", true);
      const query = Parse.Query.fromJSON(Picture, context.state.query);
      query.skip(context.state.currentPos);
      query.limit(ITEMS_PER_PAGE);
      const picture = await query.find();
      await context.dispatch("addItems", picture);
      context.commit("setLoading", false);
    },
    async addItems(context: any, result: any) {
      const {results, count} = result;
      await context.dispatch("addItems", {keys: MODEL_KEYS, items: results}, { root: true });
      await context.commit("addToFeed", {feed: results.map((a: Parse.Object) => a.id), total: count});
    },
    async refresh(context: any) {
      context.commit("setLoading", true);
      context.dispatch("unsubscribe", 'feed', {root: true});
      const teams = context.rootGetters["auth/teamPointers"];
      const query = (new Parse.Query(Picture))
        .containedIn("team", teams)
        .include(MODEL_KEYS)
        .limit(ITEMS_PER_PAGE)
        .descending("createdAt")
        .withCount(true);
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