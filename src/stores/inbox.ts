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
    messages: {},
  }),
  getters: {
    latest(state: InboxT, getters: any, rootState: any, rootGetters: any) {
      const objs = rootGetters["objectsMap"];

      return state.latest.map((id) => objs[id])
    },
    messages(state: InboxT) {
      return state.messages
    }
  },
  mutations: {
    setConvos(state: InboxT, items: Array<Parse.Object>) {
      items.forEach((c) => {
        const msg = c.get("latestMesssage");
        if (!msg) {
          return
        }
        if (!state.messages[c.id]) {
          state.messages[c.id] = [msg.id]
        } else {
          if (!state.messages[c.id].includes(msg.id)) {
            state.messages[c.id].unshift(msg.id)
          }
        }
      })
      state.latest = items.map((a) => a.id);
    },
    setMessages(state: InboxT, data: any) {
      const { conversationId, items } = data;
      // FIXME: do something smarter
      state.messages[conversationId] = items.map((x: Parse.Object) => x.id)
    },
    addItem(state: InboxT, item: string) {
      state.latest.unshift(item);
    },
    setLoading(state: InboxT, value: boolean) {
      state.loading = value;
    }
  },
  actions: {
    async loadMessages(context: any, conversationId: string) {
      context.commit("setLoading", true);
      const keys = ["author"];
      const convo = new Conversation();
      convo.id = conversationId;
      const query = (new Parse.Query(Message))
        .include(keys)
        .equalTo("conversation", convo.toPointer())
        .descending("createdAt");
      const feed = await query.find();
      await context.dispatch("addItems", {keys, items: feed}, { root: true });
      context.commit("setMessages", {conversationId, items: feed});
      context.commit("setLoading", false);
    },
    async refresh(context: any) {
      if (!context.rootGetters["auth/isLoggedIn"]) {
        return
      }
      const keys = ["participants", "team", "latestMessage"];
      context.commit("setLoading", true);
      const query = (new Parse.Query(Conversation))
        .include(keys)
        .descending("updatedAt");
      const feed = await query.find();
      console.log("found conversations feed:", feed);

      await context.dispatch("addItems", {keys, items: feed}, { root: true });
      context.commit("setConvos", feed)
      context.commit("setLoading", false);
    },
  },
};