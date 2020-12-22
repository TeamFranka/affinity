
import { Parse } from "../config/Consts";

export interface GlobalStateT {
  loadingCounter: number;
  defaultTeam: Parse.Object | null;
  objects: Record<string, Parse.Object>;
}

export const GlobalState = {
  state: () => ({
    loadingCounter: 0,
    objects: {},
  }),
  getters: {
    objectsMap(state: GlobalStateT): Record<string, Parse.Object> {
      return state.objects;
    },
    isLoading(state: GlobalStateT): boolean {
      return state.loadingCounter < 1
    }
  },
  mutations: {
    setItems(state: GlobalStateT, items: Array<Parse.Object>) {
      items.forEach((item) => {
        state.objects[item.id] = item;
      })
    },
    setItem(state: GlobalStateT, item: Parse.Object) {
      state.objects[item.id] = item;
    },
    setGlobalTeam(state: GlobalStateT, team: Parse.Object) {
      state.defaultTeam = team;
      state.objects[team.id] = team;
    },
    startLoading(state: GlobalStateT) {
      state.loadingCounter += 1;
    },
    doneLoading(state: GlobalStateT) {
      state.loadingCounter -= 1;
    },
  },
  actions: {
    fetchDefaultTeam(context: any, teamId: string) {
      context.commit("startLoading");
      (new Parse.Query("Team")).get(teamId).then((resp)=>{
        context.commit("setGlobalTeam", resp)
        context.commit("doneLoading");
      }, (err)=> {
        console.error("fetching default team failed", err);
        context.commit("doneLoading");
      });
    },
    refreshRoot(context: any) {
      context.dispatch("news/refresh");
      context.dispatch("feed/refresh");
    },
    routingStart(context: any) {
        context.commit("startLoading");
    },
    routingEnd(context: any) {
        context.commit("doneLoading");
    },
    addItems(context: any, inp: any) {
      const { items, key, keys } = inp;
      console.log("items", items);
      const found: Array<Parse.Object> = [];
      const toLookUp: Record<string, Array<string>> = {};
      const sort = (m: Parse.Object) => {
          if (m.isDataAvailable()) {
              found.push(m);
          } else {
            if (!context.state.objecsts[m.id]?.isDataAvailable()) {
              if (!toLookUp[m.className]) {
                toLookUp[m.className] = [m.id];
              } else {
                toLookUp[m.className].push(m.id);
              }
            }
          }
      };
      items.forEach((i: Parse.Object) => {
        sort(i);
        key && (i.get(key) || []).forEach(sort);
        keys && (keys.forEach((key: string) => (i.get(key) || []).forEach(sort)));
      });

      if (found.length > 0) {
        context.commit("setItems", found)
      }

      console.log("Updating", toLookUp);
      Object.keys(toLookUp).forEach((k) => {
        (new Parse.Query(k)).containedIn("id", toLookUp[k]).find().then((resp) => {
          console.log("received results for ", k, resp);
          context.commit("setItems", resp)
        });
      });
    },
    async fetchModel(context: any, info: any) {
      const { className, objectId, includes } = info;
      const query = (new Parse.Query(className));
      (includes || []).forEach((k: string) => query.include(k));
      const model = await query.get(objectId);
      let items = [model];
      (includes || []).forEach((k: string) => {
        const m = model.get(k)
        if (!m) return;
        if (Array.isArray(m)) {
          items = items.concat(m);
        } else {
          items.push(m);
        }
      });

      context.commit("setItems", items);
    },
  }
}

