import { Parse, Verb } from "@/config/Consts";
import { Activity, Team } from "@/db/models";
import { toModel, Model } from "@/utils/model";

export interface TeamsT {
  loading: boolean;
  news: Record<string, Array<string>>;
  activities: Record<string, Array<string>>;
  subteams: Record<string, Array<string>>;
}

const MODEL_KEYS = ["objects"];

export const Teams = {
  namespaced: true,
  state: () => ({
    loading: true,
    news: {},
    activities: {},
    subteams: {},
  }),
  getters: {},
  mutations: {
    setNews(state: TeamsT, res: any) {
      const { teamId, news } = res;
      state.news[teamId] = news;
    },
    setActivities(state: TeamsT, res: any) {
      const { teamId, activities } = res;
      state.activities[teamId] = activities;
    },
    setSubteams(state: TeamsT, res: any) {
      const { teamId, teams } = res;
      state.subteams[teamId] = teams;
    },
  },
  actions: {
    async fetch(context: any, slug: string) {
      const resp = await Parse.Cloud.run("getTeam", { slug });
      await context.commit("setItems", resp.teams, { root: true });
      await context.commit("auth/addPermissions", resp.permissions, {
        root: true,
      });
    },
    async fetchSubteams(context: any, parentTeam: Parse.Pointer) {
      const query = new Parse.Query(Team).equalTo("subOf", parentTeam);
      const teams = await query.find();

      await context.commit("setItems", teams.map(toModel), { root: true });
      await context.commit("setSubteams", {
        teamId: parentTeam.objectId,
        teams: teams.map((x: any) => x.id),
      });
    },
    async createSubteam(context: any, data: any): Promise<Model> {
      const team = new Team(data);
      await team.save();
      const converted = toModel(team);
      await context.commit("setItems", [converted], { root: true });
      return converted;
    },
    async fetchNews(context: any, team: Parse.Pointer) {
      const query = new Parse.Query(Activity)
        .equalTo("verb", Verb.Announce)
        .equalTo("team", team)
        .include(MODEL_KEYS)
        .descending("createdAt");
      const news = await query.find();

      await context.dispatch(
        "addItems",
        { items: news, keys: MODEL_KEYS },
        { root: true }
      );
      context.commit("setNews", {
        teamId: team.objectId,
        news: news.map((a) => a.id),
      });
    },
    async fetchActivities(context: any, team: Parse.Pointer) {
      const query = new Parse.Query(Activity)
        .equalTo("team", team)
        .include(MODEL_KEYS)
        .descending("createdAt");
      const items = await query.find();

      await context.dispatch(
        "addItems",
        { items, keys: MODEL_KEYS },
        { root: true }
      );
      context.commit("setActivities", {
        teamId: team.objectId,
        activities: items.map((a) => a.id),
      });
    },
  },
};
