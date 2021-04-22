import { Parse, Verb } from "../config/Consts";
import { Activity } from "../db/models";
import { Model } from "@/utils/model";
import { Feed as FeedEntry } from "./globals";

export interface FeedT {
  selectedTeam: string | null;
}

const MODEL_KEYS = ["objects", "author", "team"];

export const Feed = {
  namespaced: true,
  state: () => ({
    seletedTeam: null,
  }),
  getters: {
    feedId(state: FeedT): string {
      return state.selectedTeam ? `${state.selectedTeam}-feed` : "feed"
    },
    currentFeed(
      state: FeedT,
      getters: any,
      rootState: any,
      rootGetters: any,
    ): FeedEntry | null {
      return rootGetters.feeds[getters.feedId] || null
    },
    loading(state: FeedT, getters: any): boolean {
      return getters.currentFeed?.loading;
    },
    latestPosts(
      state: FeedT,
      getters: any,
      rootState: any,
      rootGetters: any
    ): Model[] {
      const objs = rootGetters["objectsMap"];
      return getters.currentFeed?.entries.map((id: string) => objs[id]);
    },
    canLoadMore(state: FeedT, getters: any): boolean {
      if (getters.loading) return false;
      return getters.currentFeed?.currentPos < getters.currentFeed?.total;
    },
  },
  mutations: {
    setSelectedTeam(state: FeedT, name: string | null) {
      state.selectedTeam = name;
    },
  },
  actions: {
    async loadMore(context: any) {
      context.dispatch("loadMore", context.getters.feedId, { root: true });
    },
    async selectTeam(context: any, selection: string | null) {
      // informing the root, we are leaving the view
      await context.dispatch("leaveFeed", context.getters.feedId, { root: true });
      await context.commit("setSelectedTeam", selection);
      await context.dispatch("refresh");
    },
    async refresh(context: any) {
      const teams = context.rootGetters["auth/teamPointers"];
      const baseQuery = new Parse.Query(Activity)
        .containedIn("verb", [Verb.Post, Verb.Announce])
        .include(MODEL_KEYS)
        .descending("createdAt");

      const query = context.state.selectedTeam ?
        baseQuery.equalTo("team", {
            __type: "Pointer",
            className: "Team",
            objectId: context.state.selectedTeam,
          }) :
        baseQuery.containedIn("team", teams);

      const feedId = context.getters.feedId;
      await context.dispatch("queryFeed", {
        id: feedId,
        keys: MODEL_KEYS,
        query,
      }, { root: true })
    },
  },
};
