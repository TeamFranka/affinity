import { Parse } from "../config/Consts";
import { Conversation, Message } from "../db/models";

export interface InboxT {
  loading: boolean;
  latest: Array<string>;
  messages: Record<string, string[]>;
}

export const Inbox = {
  namespaced: true,
  state: () => ({
    loading: true,
    latest: [],
    messages: [],
  }),
  getters: {
    latest(state: InboxT, getters: any, rootState: any, rootGetters: any) {
      const objs = rootGetters["objectsMap"];

      return state.latest.map((id) => objs[id])
    }
  },
  mutations: {
    setConvo(state: InboxT, items: Array<string>) {
      state.latest = items;
    },
    addItem(state: InboxT, item: string) {
      state.latest.unshift(item);
    },
    setLoading(state: InboxT, value: boolean) {
      state.loading = value;
    }
  },
  actions: {
    async refresh(context: any) {
      if (!context.getters["auth/isLoggedIn"]) {
        return
      }
      context.commit("setLoading", true);
      const query = (new Parse.Query(Conversation))
        .include(["participants", "latestMessage"])
        .descending("updatedAt");
      const feed = await query.find();

      await context.dispatch("addItems", {key: "participants", items: feed}, { root: true });
      context.commit("setConvo", feed.map((a) => a.id))
      context.commit("setLoading", false);
    },
  },
};