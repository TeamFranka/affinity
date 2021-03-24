import { Parse } from "@/config/Consts";
import { Model, SaveModel, toModel } from "@/utils/model";

export interface GlobalStateT {
  loadingCounter: number;
  defaultTeamId: string;
  objects: Record<string, Model>;
  teamsBySlug: Record<string, string>;
  subscriptions: Record<string, any>;
}

export const GlobalState = {
  state: () => ({
    loadingCounter: 0,
    objects: {},
    defaultTeamId: (window as any) ? (window as any).AFFINITY_DEFAULT_TEAM : "",
    teamsBySlug: {},
    subscriptions: {},
  }),
  getters: {
    defaultTeamId(state: GlobalStateT): string {
      return state.defaultTeamId;
    },
    defaultTeam(state: GlobalStateT): Model | null {
      return state.objects[state.defaultTeamId];
    },
    objectsMap(state: GlobalStateT): Record<string, Model> {
      return state.objects;
    },
    teamsBySlug(state: GlobalStateT) {
      return state.teamsBySlug;
    },
    isLoading(state: GlobalStateT): boolean {
      return state.loadingCounter < 1;
    },
  },
  mutations: {
    setItems(state: GlobalStateT, items: Array<Parse.Object | Model>) {
      items.forEach((item) => {
        const model: Model = item instanceof Model ? item : toModel(item);
        state.objects[model.objectId] = model;
        if (model.className == "Team") {
          state.teamsBySlug[model.slug] = model.objectId;
        }
      });
    },
    setItem(state: GlobalStateT, model: Model) {
      state.objects[model.objectId] = model;
      if (model.className == "Team") {
        state.teamsBySlug[model.slug] = model.objectId;
      }
    },
    setDefaultTeamId(state: GlobalStateT, teamId: string) {
      state.defaultTeamId = teamId;
    },
    setGlobalTeam(state: GlobalStateT, team: Model) {
      state.objects[team.objectId] = team;
      state.defaultTeamId = team.objectId;
      state.teamsBySlug[team.slug] = team.objectId;
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
      context.commit("setDefaultTeamId", teamId);
      context.commit("startLoading");
      new Parse.Query("Team").get(teamId).then(
        (resp) => {
          context.commit("setGlobalTeam", toModel(resp));
          context.commit("doneLoading");
        },
        (err) => {
          console.error("fetching default team failed", err);
          context.commit("doneLoading");
        }
      );
    },
    refreshRoot(context: any) {
      context.dispatch("news/refresh");
      context.dispatch("feed/refresh");
      context.dispatch("faq/refresh");
      context.dispatch("inbox/refresh");
    },
    init(context: any) {
      context.dispatch("auth/init");
    },
    routingStart(context: any) {
      context.commit("startLoading");
    },
    routingEnd(context: any) {
      context.commit("doneLoading");
    },
    addItems(context: any, inp: any) {
      const { items, key, keys } = inp;
      const found: Array<Parse.Object | Model> = [];
      const toLookUp: Record<string, Array<string>> = {};
      const sort = (p: Parse.Object) => {
        const m = toModel(p);
        if (m.isDataAvailable()) {
          found.push(m);
        } else {
          if (!context.state.objects[m.objectId]?.isDataAvailable()) {
            if (!toLookUp[m.className]) {
              toLookUp[m.className] = [m.objectId];
            } else {
              toLookUp[m.className].push(m.objectId);
            }
          }
        }
      };
      const sortMany = (i: any) =>
        Array.isArray(i) ? i.forEach(sort) : sort(i);
      items.forEach((i: Parse.Object) => {
        key && sortMany(i.get(key) || []);
        keys && keys.forEach((key: string) => sortMany(i.get(key) || []));
        sort(i);
      });

      if (found.length > 0) {
        context.commit("setItems", found);
      }

      Object.keys(toLookUp).forEach((k) => {
        new Parse.Query(k)
          .containedIn("id", toLookUp[k])
          .find()
          .then((resp) => {
            context.commit("setItems", resp);
          });
      });
    },
    async updateModel(context: any, info: SaveModel) {
      const model = info.toParse();
      await model.save();
      console.log(model);
      context.commit("setItem", toModel(model));
    },
    async fetchModel(context: any, info: any) {
      const { className, objectId, includes } = info;
      const query = new Parse.Query(className);
      (includes || []).forEach((k: string) => query.include(k));
      const model = await query.get(objectId);
      let items = [model];
      (includes || []).forEach((k: string) => {
        const m = model.get(k);
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
      const sub = context.state.subscriptions[id];
      context.commit("setSubscription", { id, sub: null });
      if (sub) {
        sub.unsubscribe();
      }
    },
    async subscribe(context: any, data: any) {
      const { id, query, keys, addCb, rmCb, full } = data;
      if (context.state.subscriptions[id]) {
        context.state.subscriptions[id].unsubscribe();
      }
      const subscription = await query.subscribe();
      subscription.on("create", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        addCb && context.commit(addCb, full ? object : object.id);
      });
      subscription.on("enter", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        addCb && context.commit(addCb, full ? object : object.id);
      });

      subscription.on("update", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
      });

      subscription.on("delete", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        rmCb && context.commit(rmCb, full ? object : object.id);
      });
      subscription.on("leave", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        addCb && context.commit(addCb, full ? object : object.id);
      });

      context.commit("setSubscription", { id, sub: subscription });
    },
  },
};
