import { Parse } from "../config/Consts";

export interface TeamsT {
  loading: boolean;
}

export const Teams = {
  namespaced: true,
  state: () => ({
    loading: true
  }),
  getters: {
  },
  mutations: {
  },
  actions: {
    async fetch(context: any, slug: string) {
      const resp = await Parse.Cloud.run("getTeam", { slug });
      await context.commit("setItems", resp.teams, {root: true});
      await context.commit("auth/addPermissions", resp.permissions, { root: true });
    },
    async setSetting(context: any, params: any) {
      const team = context.rootGetters.objectsMap[params.id]
      delete params.id
      await team.save(params);
    }
  },
};