import { Parse } from "../config/Consts";
import { Conversation, Message, Notification } from "../db/models";

export interface InboxT {
  loading: boolean;
  latest: Array<string>;
  notifications: Array<string>;
  messages: Record<string, string[]>;
}

export const Inbox = {
  namespaced: true,
  state: () => ({
    loading: true,
    latest: [],
    notifications: [],
    messages: {},
  }),
  getters: {
    latest(state: InboxT, getters: any, rootState: any, rootGetters: any) {
      const objs = rootGetters["objectsMap"];

      return state.latest.map((id) => objs[id]);
    },
    notifications(
      state: InboxT,
      getters: any,
      rootState: any,
      rootGetters: any
    ) {
      const objs = rootGetters["objectsMap"];

      return state.notifications.map((id) => objs[id]);
    },
    messages(state: InboxT) {
      return state.messages;
    },
  },
  mutations: {
    newConversation(state: InboxT, c: Parse.Object) {
      const msg = c.get("latestMesssage");
      if (!msg) {
        return;
      }
      if (!state.messages[c.id]) {
        state.messages[c.id] = [msg.id];
      } else {
        if (!state.messages[c.id].includes(msg.id)) {
          state.messages[c.id].unshift(msg.id);
        }
      }
      state.latest.unshift(c.id);
    },
    setNotifications(state: InboxT, items: Array<Parse.Object>) {
      state.notifications = items.map((x) => x.id);
    },
    setConvos(state: InboxT, items: Array<Parse.Object>) {
      items.forEach((c) => {
        const msg = c.get("latestMesssage");
        if (!msg) {
          return;
        }
        if (!state.messages[c.id]) {
          state.messages[c.id] = [msg.id];
        } else {
          if (!state.messages[c.id].includes(msg.id)) {
            state.messages[c.id].unshift(msg.id);
          }
        }
      });
      state.latest = items.map((a) => a.id);
    },
    setMessages(state: InboxT, data: any) {
      const { conversationId, items } = data;
      // FIXME: do something smarter
      state.messages[conversationId] = items.map((x: Parse.Object) => x.id);
    },
    msgReceived(state: InboxT, msg: Parse.Object) {
      const conversationId = msg.get("conversation").id;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [msg.id];
      } else {
        state.messages[conversationId].unshift(msg.id);
      }
    },
    setLoading(state: InboxT, value: boolean) {
      state.loading = value;
    },
  },
  actions: {
    async loadMessages(context: any, conversationId: string) {
      context.commit("setLoading", true);
      const keys = ["author", "objects"];
      const convo = new Conversation();
      convo.id = conversationId;
      const query = new Parse.Query(Message)
        .include(keys)
        .equalTo("conversation", convo.toPointer())
        .descending("createdAt");
      const feed = await query.find();
      await context.dispatch("addItems", { keys, items: feed }, { root: true });
      context.commit("setMessages", { conversationId, items: feed });
      context.commit("setLoading", false);
      context.dispatch(
        "subscribe",
        {
          id: `conversation/${conversationId}`,
          keys,
          query,
          addCb: "inbox/msgReceived",
          full: true,
        },
        { root: true }
      );
    },
    async refresh(context: any) {
      if (!context.rootGetters["auth/isLoggedIn"]) {
        context.commit("setConvos", []);
        context.commit("setLoading", false);
        context.dispatch("unsubscribe", "conversations", { root: true });
        context.dispatch("unsubscribe", "notifications", { root: true });
        return;
      }
      context.commit("setLoading", true);
      await Promise.all([
        context.dispatch("refreshConvos"),
        context.dispatch("refreshNotifications"),
      ]);
      context.commit("setLoading", false);
    },
    async refreshNotifications(context: any) {
      const keys = ["by", "objects"];
      const query = new Parse.Query(Notification)
        .include(keys)
        .descending("createdAt");
      const feed = await query.find();

      await context.dispatch("addItems", { keys, items: feed }, { root: true });
      context.dispatch(
        "subscribe",
        {
          id: "notifications",
          keys,
          query,
          addCb: "inbox/newNotification",
          full: true,
        },
        { root: true }
      );
      context.commit("setNotifications", feed);
    },
    async refreshConvos(context: any) {
      const keys = ["participants", "team", "latestMessage"];
      const query = new Parse.Query(Conversation)
        .include(keys)
        .descending("updatedAt");
      const feed = await query.find();

      await context.dispatch("addItems", { keys, items: feed }, { root: true });
      context.dispatch(
        "subscribe",
        {
          id: "conversations",
          keys,
          query,
          addCb: "inbox/newConversation",
          full: true,
        },
        { root: true }
      );
      context.commit("setConvos", feed);
    },
  },
};
