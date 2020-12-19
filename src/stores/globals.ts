
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
  getters: {
    objectsMap(state: GlobalStateT) {
      return state.objects;
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
    addItems(context: any, inp: any) {
      const { items, key } = inp;
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
        key && (i.get(key) || []).forEach(sort)
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
    }
  }
}

