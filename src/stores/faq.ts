import { Parse } from "../config/Consts";
import { FaqEntry } from "../db/models/index.js";

export interface FaqT {
  loading: boolean;
  entries: Array<string>;
}

export const Faq = {
  namespaced: true,
  state: () => ({
    loading: false,
    entries: [],
  }),
  getters: {
    loading(state: FaqT): boolean {
      return state.loading
    },
    entries(state: FaqT): Array<string> {
      return state.entries
    },
  },
  mutations: {
    setFaq(state: FaqT, items: Array<string>) {
      state.entries = items;
    },
    setLoading(state: FaqT, val: boolean) {
      state.loading = val;
    },
  },
  actions: {
    async refresh(context: any) {
      context.commit("setLoading", true);
      const teams = context.rootGetters["auth/myTeams"];
      teams.push(context.state.defaultTeam);
      console.log(teams);
      const entries = await (new Parse.Query(FaqEntry))
        .containedIn("team", teams)
        .descending("createdAt")
        .find();

      await context.dispatch("addItems", { items: entries }, { root: true });
      context.commit("setFaq", entries.map((a) => a.id))
      context.commit("setLoading", false);
    },
  },
};