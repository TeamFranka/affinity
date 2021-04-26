import { toModel } from "@/utils/model";
import { Activity, Team } from "@/db/models";
import { VuexModule, Module, Action, getModule, Mutation } from "vuex-module-decorators";
import { store } from ".";
import { Parse, Verb } from "@/config/Consts";
import { ParseTeam, TTeam } from "@/types/team";

export interface TeamsStoreState {
  loading: boolean;
  news: Record<TTeam['objectId'], string[]>;
  activities: Record<TTeam['objectId'], string[]>;
  subteams: Record<TTeam['objectId'], TTeam['objectId'][]>;
  teamIds: TTeam['objectId'][];
}

@Module({
  name: 'teams2',
  store,
  dynamic: true,
  namespaced: true,
})
class TeamsStoreModule extends VuexModule {
  loading = false;
  news: Record<ParseTeam['id'], string[]> = {};
  activities: Record<ParseTeam['id'], string[]> = {};
  subteams: Record<ParseTeam['id'], ParseTeam['id'][]> = {};
  teamIds: ParseTeam['id'][] = [];

  get teams(): TTeam[] {
    return this.context.rootGetters.parseModels(this.teamIds);
  }

  get team() {
    return (id: ParseTeam['id']) => this.context.rootGetters.parseModel(id) as TTeam;
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @Mutation
  setTeams(teams: ParseTeam[]) {
    this.teamIds = teams.map(({ id }) => id);
  }

  @Mutation
  setNews(res: any) {
    const { teamId, news } = res;
    this.news[teamId] = news;
  }

  @Mutation
  setActivities(res: any) {
    const { teamId, activities } = res;
    this.activities[teamId] = activities;
  }

  @Mutation
  setSubteams(res: any) {
    const { teamId, teams } = res;
    this.subteams[teamId] = teams;
  }

  @Action
  async fetchTeams() {
    this.setLoading(true);

    const { teams, permissions } = await Parse.Cloud.run("getTeams") as { teams: ParseTeam[], permissions: any };
    this.context.commit("setParseObjects", teams, { root: true });
    this.context.commit("auth/addPermissions", permissions, { root: true });
    this.setTeams(teams);
    this.setLoading(false);
  }

  @Action
  async fetch(slug: string) {
    const resp = await Parse.Cloud.run("getTeam", { slug });
    this.context.commit("setItems", resp.teams, { root: true });
    this.context.commit("auth/addPermissions", resp.permissions, {
      root: true,
    });
  };

  @Action
  async fetchSubteams(parentTeam: Parse.Pointer) {
    this.setLoading(true);
    const query = new Parse.Query(Team).equalTo("subOf", parentTeam);
    const teams = await query.find();
    this.context.commit("setItems", teams.map(toModel), { root: true });

    const subteams = teams.map(({ id }) => id);
    this.setSubteams({ teamId: parentTeam.objectId, subteams });
    this.setLoading(false);
  };

  @Action
  async createSubteam(data: any) {
    const team = new Team(data);
    await team.save();
    const converted = toModel(team);
    this.context.commit("setItems", [converted], { root: true });
    return converted;
  };

  @Action
  async fetchNews(team: Parse.Pointer) {
    this.setLoading(true);
    const query = new Parse.Query(Activity)
      .equalTo("verb", Verb.Announce)
      .equalTo("team", team)
      .include(["objects"])
      .descending("createdAt");
    const items = await query.find();

    this.context.dispatch("addItems", { items, keys: ["objects"] }, { root: true });

    const news = items.map(({ id }) => id);
    this.setNews({ teamId: team.objectId, news });
    this.setLoading(false);
  };

  @Action
  async fetchActivities(team: Parse.Pointer) {
    this.setLoading(true);
    const query = new Parse.Query(Activity)
      .equalTo("team", team)
      .include(["objects"])
      .descending("createdAt");
    const items = await query.find();

    this.context.dispatch("addItems", { items, keys: ["objects"] }, { root: true });

    const activities = items.map(({ id }) => id);
    this.setActivities({ teamId: team.objectId, activities });
    this.setLoading(false);
  };
}

export default getModule(TeamsStoreModule);
