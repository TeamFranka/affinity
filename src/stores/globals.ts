
import { Parse } from "@/config/Consts";
import { Model, toModel } from '@/utils/model';

export interface GlobalStateT {
  loadingCounter: number;
  defaultTeam: Model | null;
  defaultTeamId: string;
  objects: Record<string, Model>;
  teamsBySlug: Record<string, string>;
  subscriptions: Record<string, any>;
}

export const GlobalState = {
  state: () => ({
    loadingCounter: 0,
    objects: {},
    defaultTeam: null,
    defaultTeamId: (window as any) ? (window as any).AFFINITY_DEFAULT_TEAM : '',
    teamsBySlug: {},
    subscriptions: {}
  }),
  getters: {
    defaultTeamId(state: GlobalStateT): string {
      return state.defaultTeam?.id || state.defaultTeamId;
    },
    defaultTeam(state: GlobalStateT): any | null {
      return state.defaultTeam;
    },
    objectsMap(state: GlobalStateT): Record<string, any> {
      return state.objects;
    },
    teamsBySlug(state: GlobalStateT) {
      return state.teamsBySlug
    },
    isLoading(state: GlobalStateT): boolean {
      return state.loadingCounter < 1
    }
  },
  mutations: {
    setItems(state: GlobalStateT, items: Array<Parse.Object>) {
      items.forEach((item) => {
        this.setItem(state, toModel(item));
      })
    },
    setItem(state: GlobalStateT, model: Model) {
      state.objects[model.id] = model;
      if (model.className == "Team") {
        state.teamsBySlug[model.slug] = model.id;
      }
    },
    setDefaltTeamId(state: GlobalStateT, teamId: string) {
      state.defaultTeamId = teamId;
    },
    setGlobalTeam(state: GlobalStateT, team: Model) {
      state.defaultTeam = team;
      state.defaultTeamId = team.id;
      state.objects[team.id] = team;
    },
    setSubscription(state: GlobalStateT, data: any) {
      const { id, sub } = data;
      state.subscriptions[id] = sub;
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
      context.commit("setDefaltTeamId", teamId);
      context.commit("startLoading");
      console.log("fetching  team", teamId);
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
      context.dispatch("faq/refresh");
      context.dispatch("inbox/refresh");
    },
    routingStart(context: any) {
        context.commit("startLoading");
    },
    routingEnd(context: any) {
        context.commit("doneLoading");
    },
    addItems(context: any, inp: any) {
      const { items, key, keys } = inp;
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
      const sortMany = (i: any) => Array.isArray(i) ? i.forEach(sort) : sort(i);
      items.forEach((i: Parse.Object) => {
        sort(i);
        key && sortMany(i.get(key) || []);
        keys && (keys.forEach((key: string) => sortMany(i.get(key) || [])));
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
    unsubscribe(context: any, id: string) {
      const sub = context.state.subscriptions[id]
      context.commit("setSubscription", {id, sub: null});
      if (sub) {
        sub.unsubscribe()
      }
    },
    async subscribe(context: any, data: any) {
      const { id, query, keys, addCb, rmCb, full} = data;
      if (context.state.subscriptions[id]) {
        context.state.subscriptions[id].unsubscribe()
      }
      const subscription = await query.subscribe();
      subscription.on('create', async (object: Parse.Object) => {
        await context.dispatch("addItems", {keys, items: [object]});
        addCb && context.commit(addCb, full ? object : object.id)
      });
      subscription.on('enter', async (object: Parse.Object) => {
        await context.dispatch("addItems", {keys, items: [object]});
        addCb && context.commit(addCb, full ? object : object.id)
      });

      subscription.on('update', async (object: Parse.Object) => {
        await context.dispatch("addItems", {keys, items: [object]});
      });

      subscription.on('delete', async (object: Parse.Object) => {
        await context.dispatch("addItems", {keys, items: [object]});
        rmCb && context.commit(rmCb, full ? object : object.id)
      });
      subscription.on('leave', async (object: Parse.Object) => {
        await context.dispatch("addItems", {keys, items: [object]});
        addCb && context.commit(addCb, full ? object : object.id)
      });

      context.commit("setSubscription", {id, sub: subscription});
    }
  }
}

