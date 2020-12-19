
import { Parse } from "../config/Consts";

export interface GlobalStateT {
  loading: boolean;
  objects: Record<string, Parse.Object>;
}

export const GlobalState = {
  state: () => ({
    loading: false,
    objects: {},
  }),
  getters: {},
  mutations: {
    addActivities(state: GlobalStateT, items: Array<Parse.Object>){
      console.log("items", items);
      items.forEach(i => {
        (i.get("objects") || []).forEach((m: Parse.Object) => {
            if (m.isDataAvailable()) {
                state.objects[m.id] = m;
            }
        });
        state.objects[i.id] = i;
      });
    },
    setLoading(state: GlobalStateT, s: boolean) {
      state.loading = s;
    }
  },
  actions: {
    refreshRoot(context: any) {
      context.dispatch("news/refresh");
      context.dispatch("feed/refresh");
    },
    routingStart(context: any) {
        context.commit("setLoading", true);
    },
    routingEnd(context: any) {
        context.commit("setLoading", false);
    },
  }
}

