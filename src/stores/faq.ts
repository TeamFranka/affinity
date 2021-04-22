
import { Parse, Verb } from "../config/Consts";
import { FaqEntry } from "../db/models";
import { Model } from "@/utils/model";
import { Feed as FeedEntry } from "./globals";


const MODEL_KEYS = ["objects", "author", "team"];

export interface FaqT {
  selectedTeam: string | null;
}

export const Faq = {
  namespaced: true,
  state: () => ({
    seletedTeam: null,
  }),
  getters: {
    feedId(state: FaqT): string {
      return state.selectedTeam ? `${state.selectedTeam}-faq` : "faq"
    },
    currentFeed(
      state: FaqT,
      getters: any,
      rootState: any,
      rootGetters: any,
    ): FeedEntry | null {
      return rootGetters.feeds[getters.feedId] || null
    },
    loading(state: FaqT, getters: any): boolean {
      return getters.currentFeed?.loading;
    },
    entries( state: FaqT, getters: any,): Model[] {
      return getters.currentFeed?.entries || []
    },
    canLoadMore(state: FaqT, getters: any): boolean {
      if (getters.loading) return false;
      return getters.currentFeed?.currentPos < getters.currentFeed?.total;
    },
  },
  mutations: {
    setSelectedTeam(state: FaqT, name: string | null) {
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
      const baseQuery = new Parse.Query(FaqEntry)
        .descending("createdAt")
        .include(MODEL_KEYS);

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