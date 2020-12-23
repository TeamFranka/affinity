// import { TeamSettings } from '@/db/schemas/team';
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
      const items: any[] = [];
      resp.teams.forEach( (t: Parse.Object)  => { items.push(t); items.push(t.get("settings")) });
      await context.commit("setItems", items, {root: true});
      await context.commit("auth/addPermissions", resp.permissions, { root: true });
    },
    async setSetting(context: any, params: any, ){
      const settings = context.rootGetters.objectsMap[params.id]
      delete params.id
      await settings.save(params);
    }
  },
};