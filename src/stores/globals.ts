
export interface GlobalStateT {
  loading: boolean;
}

export const GlobalState = {
  setup: () => ({
    loading: true,
  }),
  getters: {},
  mutations: {
    setLoading(state: GlobalStateT, s: boolean) {
      state.loading = s;
    }
  },
  actions: {
    routingStart(context: any) {
        context.commit("setLoading", true);
    },
    routingEnd(context: any) {
        context.commit("setLoading", false);
    }
  }
}

