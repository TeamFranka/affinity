import { Parse, Activity, Verb } from "../config/Consts";

const MODEL_KEYS = ["objects", "team"];
export interface NewsT {
  loading: boolean;
  latest: Array<string>;
}

export const News = {
  namespaced: true,
  state: () => ({
    loading: false,
    latest: [],
  }),
  getters: {
    loading(state: NewsT): boolean {
      return state.loading;
    },
    latest(state: NewsT): Array<string> {
      return state.latest;
    },
  },
  mutations: {
    setNews(state: NewsT, items: Array<string>) {
      state.latest = items;
    },
    setLoading(state: NewsT, val: boolean) {
      state.loading = val;
    },
    addItem(state: NewsT, item: string) {
      state.latest.unshift(item);
    },
    rmItem(state: NewsT, item: string) {
      state.latest = state.latest.filter((x) => x !== item);
    },
  },
  actions: {
    async refresh(context: any) {
      context.commit("setLoading", true);
      const teams = context.rootGetters["auth/teamPointers"];
      const query = new Parse.Query(Activity)
        .equalTo("verb", Verb.Announce)
        .containedIn("team", teams)
        .include(MODEL_KEYS)
        .descending("createdAt");

      const news = await query.find();

      await context.dispatch(
        "addItems",
        { items: news, keys: MODEL_KEYS },
        { root: true }
      );
      await context.commit(
        "setNews",
        news.map((a) => a.id)
      );
      await context.commit("setLoading", false);
      await context.dispatch(
        "subscribe",
        {
          id: "news",
          keys: MODEL_KEYS,
          query,
          addCb: "news/addItem",
          rmCb: "news/rmItem",
        },
        { root: true }
      );
    },
  },
};
