import { Parse, Activity } from "../config/Consts";

export interface NewsT {
  latest: Array<string>;
}

export const News = {
  namespaced: true,
  state: () => ({
    latest: [],
  }),
  getters: {},
  mutations: {
    setNews(state: NewsT, items: Array<string>) {
      state.latest = items;
    },
  },
  actions: {
    async refresh(context: any) {
      const teams = context.rootGetters["auth/myTeams"];
      const news = await (new Parse.Query(Activity))
        .equalTo("verb", "announced")
        .containedIn("team", teams)
        .include("objects")
        .descending("createdAt")
        .find();

      await context.dispatch("addItems", { items: news, key: "objects" }, { root: true });
      context.commit("setNews", news.map((a) => a.id))

      // FIXME: add live query support to stay up to date;
      // https://docs.parseplatform.org/js/guide/#live-queries
    },
  },
};