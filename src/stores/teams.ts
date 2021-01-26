import { Parse, Verb } from "../config/Consts";
import { Activity } from "../db/models";

export interface TeamsT {
  loading: boolean;
  news: Record<string, Array<string>>;
}

const MODEL_KEYS = ['objects'];

export const Teams = {
  namespaced: true,
  state: () => ({
    loading: true,
    news: {}
  }),
  getters: {
  },
  mutations: {
    setNews(state: TeamsT, res: any){
      const { teamId, news } = res;
      state.news[teamId] = news;
    }
  },
  actions: {
    async fetch(context: any, slug: string) {
      const resp = await Parse.Cloud.run("getTeam", { slug });
      await context.commit("setItems", resp.teams, {root: true});
      await context.commit("auth/addPermissions", resp.permissions, { root: true });
    },
    async fetchNews(context: any, team: Parse.Pointer) {
      const query = (new Parse.Query(Activity))
        .equalTo("verb", Verb.Announce)
        .equalTo("team", team)
        .include(MODEL_KEYS)
        .descending("createdAt");
      const news = await query.find();

      await context.dispatch("addItems",
        { items: news, keys: MODEL_KEYS },
        { root: true }
      );
      context.commit("setNews", {
        teamId: team.objectId,
        news: news.map((a) => a.id)
      });
    }
  },
};