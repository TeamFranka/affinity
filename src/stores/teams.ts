import { Parse, Verb } from "@/config/Consts";
import { Activity, Team } from "@/db/models";
import { TTeam } from "@/types/team";
import { toModel, Model } from "@/utils/model";
import { genFeedState } from "./globals";

export interface TeamsT {
  selectedTeam: string | null;
  news: {};
  feed: {};
  subteams: Array<string>;
  teamIds: string[];
}

const MODEL_KEYS = ["objects", "author", "team"];

export const news = genFeedState({
  keyword: "news",
  customSelectedTeam: "teams/selectedTeam",
  baseQueryFn: () =>new Parse.Query(Activity)
            .equalTo("verb", Verb.Announce)
            .include(MODEL_KEYS)
            .descending("createdAt"),
  keys: MODEL_KEYS,
});

export const feed = genFeedState({
  keyword: "feed",
  customSelectedTeam: "teams/selectedTeam",
  baseQueryFn: () => new Parse.Query(Activity)
            .equalTo("verb", Verb.Post) // the single team feed doesn't contains announcements
            .include(MODEL_KEYS)
            .descending("createdAt"),
  keys: MODEL_KEYS,
});

export const Teams = {
  namespaced: true,
  modules: {
    news: news,
    feed: feed,
  },
  state: () => ({
    selectedTeam: null,
    subteams: [],
    teamIds: [],
  }),
  getters: {
    selectedTeam(
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any,
    ): string {
      return state.selectedTeam || rootGetters["auth/selectedTeam"]
    },
    teams(state: TeamsT, getters: any, rootState: any, { objectsMap }: any): TTeam[] {
      return state.teamIds.map(x => objectsMap[x]);
    },
  },
  mutations: {
    setTeams(state: TeamsT, teams: { id: string }[]) {
      state.teamIds = teams.map(({ id }) => id);
    },
    setSelectedTeam(state: TeamsT, teamId: string) {
      state.selectedTeam = teamId;
    },
    setSubteams(state: TeamsT, teams: Array<string>) {
      state.subteams = teams;
    }
  },
  actions: {
    async fetchTeams(context: any) {
      const { teams, permissions } = await Parse.Cloud.run("getTeams");
      await context.commit("setItems", teams, { root: true });
      await context.commit("setTeams", teams);
      await context.commit("auth/addPermissions", permissions, { root: true });
    },
    async fetch(context: any, slug: string) {
      const resp = await Parse.Cloud.run("getTeam", { slug });
      await context.commit("setItems", resp.teams, { root: true });
      await context.commit("auth/addPermissions", resp.permissions, {
        root: true,
      });
    },
    async setTeam(context: any, teamId: string) {
      await context.commit("setSelectedTeam", teamId);
      await Promise.all([
        context.dispatch("news/refresh"),
        context.dispatch("feed/refresh"),
        context.dispatch("fetchSubteams", context.rootGetters["objectsMap"][teamId].toPointer())
      ])
    },
    async fetchSubteams(context: any, parentTeam: Parse.Pointer) {
      const query = new Parse.Query(Team).equalTo("subOf", parentTeam);
      const teams = await query.find();

      await context.commit("setItems", teams.map(toModel), { root: true });
      await context.commit("setSubteams", teams.map((x: any) => x.id));
    },
    async createSubteam(context: any, data: any): Promise<Model> {
      const team = new Team(data);
      await team.save();
      const converted = toModel(team);
      await context.commit("setItems", [converted], { root: true });
      return converted;
    },
  },
};
