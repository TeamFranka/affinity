import { Parse, Verb } from "@/config/Consts";
import { Activity, Team as ParseTeam } from "@/db/models";
import { Team } from "@/types/team";
import { toModel, Model } from "@/types/model";
import { genFeedState } from "./globals";

export interface TeamsT {
  selectedTeam: string | null;
  news: {};
  feed: {};
  teamsByParent: Record<string, Array<string>>;
}

const MODEL_KEYS = ["objects", "author", "team"];

export const news = genFeedState({
  keyword: "news",
  customSelectedTeam: "teams/selectedTeam",
  baseQueryFn: () =>new Parse.Query(Activity)
            .equalTo("verb", Verb.Announce)
            .include(MODEL_KEYS)
            .descending("publishedAt"),
  keys: MODEL_KEYS,
});

export const feed = genFeedState({
  keyword: "feed",
  customSelectedTeam: "teams/selectedTeam",
  baseQueryFn: () => new Parse.Query(Activity)
            .equalTo("verb", Verb.Post) // the single team feed doesn't contains announcements
            .include(MODEL_KEYS)
            .descending("publishedAt"),
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
    teamsByParent: {},
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
    rootTeams(state: TeamsT, getters: any, rootState: any, { objectsMap }: any): Team[] {
      return (state.teamsByParent[''] || []).map((id: string) => objectsMap[id])
    },
    subteams(state: TeamsT, getters: any, rootState: any, { objectsMap }: any): Record<string, Team[]> {
      const mapped: Record<string, Team[]> = {};
      Object
        .entries(state.teamsByParent)
        .forEach(([parentId, subIds]) => {
          mapped[parentId] = subIds.map(x => objectsMap[x]);
        });
      return mapped;
    },
  },
  mutations: {
    setTeams(state: TeamsT, teams: any) {
      Object.assign(state.teamsByParent,
        teams.reduce((acc : Record<string, string[]>, t : any) => {
          console.log(t, acc);
          const sub = t.subOf;
          const list = (acc[sub] || []);
          list.push(t.id);
          acc[sub] = list;
          return acc;
        }, {})
      );
    },
    setSelectedTeam(state: TeamsT, teamId: string) {
      state.selectedTeam = teamId;
    },
    setSubteams(state: TeamsT, teamsByParent: any) {
      Object.assign(state.teamsByParent, teamsByParent);
    }
  },
  actions: {
    async fetchTeams(context: any) {
      const { teams, permissions } = await Parse.Cloud.run("getTeams");
      await context.commit("setItems", teams, { root: true });
      await context.commit("setTeams", teams.map((o: Parse.Object) => ({id: o.id, subOf: (o.get("subOf")?.id) || ''})));
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
      const query = new Parse.Query(ParseTeam).equalTo("subOf", parentTeam);
      const teams = await query.find();

      await context.commit("setItems", teams.map(toModel), { root: true });
      await context.commit("setSubteams", { [parentTeam.objectId]: teams.map((x: any) => x.id)});
    },
    async createSubteam(context: any, data: any): Promise<Model> {
      const team = new ParseTeam(data);
      await team.save();
      const converted = toModel(team);
      await context.commit("setItems", [converted], { root: true });
      return converted;
    },
  },
};
