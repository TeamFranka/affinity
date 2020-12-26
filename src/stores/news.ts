import { Parse, Activity, Verb } from "../config/Consts";

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
      return state.loading
    },
    latest(state: NewsT): Array<string> {
      console.log(state);
      return state.latest
    },
  },
  mutations: {
    setNews(state: NewsT, items: Array<string>) {
      state.latest = items;
    },
    setLoading(state: NewsT, val: boolean) {
      state.loading = val;
    },
  },
  actions: {
    async refresh(context: any) {
      context.commit("setLoading", true);
      const teams = context.rootGetters["auth/myTeams"];
      teams.push(context.state.defaultTeam);
      console.log(teams);
      const news = await (new Parse.Query(Activity))
        .equalTo("verb", Verb.Announce)
        .containedIn("team", teams)
        .include("objects")
        .descending("createdAt")
        .find();

      await context.dispatch("addItems", { items: news, key: "objects" }, { root: true });
      context.commit("setNews", news.map((a) => a.id))
      context.commit("setLoading", false);

      // FIXME: add live query support to stay up to date;
      // https://docs.parseplatform.org/js/guide/#live-queries
    },
  },
};