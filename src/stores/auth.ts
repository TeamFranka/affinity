import { Parse } from '../config/Consts';
import { watch } from 'vue';

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Parse.User | null;
  teams: Array<Parse.Object>;
  teamPermissions: Record<string, any>;
}

export const AuthState = {
  namespaced: true,
  state: () => ({
    wantsToLogin: false,
    user: Parse.User.current(),
    teams: [],
    teamPermissions: {},
  }),
  getters: {
    isLoggedIn: (state: AuthStateT) => !!state.user,
    myId: (state: AuthStateT) => state.user?.id,
    defaultTeam: (state: AuthStateT, rootState: any, rootGetters: any) => rootGetters["defaultTeam"],
    user: (state: AuthStateT) => state.user,
    wantsToLogin: (state: AuthStateT) => state.wantsToLogin,
    userPtr: (state: AuthStateT) => state.user?.toPointer(),
    myTeams: (state: AuthStateT) => state.teams.filter(x => !!x),
    teamPermissions: (state: AuthStateT) => state.teamPermissions,
    hasManyTeams: (state: AuthStateT) => state.teams.length > 1,
    postableTeams: (state: AuthStateT) =>  state.teams?.filter(t => t && state.teamPermissions[t.id].canPost) || [],
    adminOfTeams: (state: AuthStateT) =>  state.teams?.filter(t => t && state.teamPermissions[t.id].isAdmin) || [],
  },
  mutations: {
    setUser(state: AuthStateT, newUser: Parse.User|null) {
      state.user = newUser
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      state.wantsToLogin = wanna;
    },
    setTeams(state: AuthStateT, resp: any) {
      console.log("setting auth teams", resp);
      state.teams = resp.teams.filter((x: any)=>!!x);
      state.teamPermissions = Object.assign(state.teamPermissions, resp.permissions);
    },
    addPermissions(state: AuthStateT, resp: any) {
      state.teamPermissions = Object.assign(state.teamPermissions, resp.permissions);
    }
  },
  actions: {
    dismissLogin(context: any) {
      context.commit("setWantsToLogin", false);
    },
    logout(context: any) {
      Parse.User.logOut();
      context.commit("setUser", null);
    },
    openLogin(context: any) {
      context.commit("setWantsToLogin", true);
    },
    async loggedIn(context: any, newUser: Parse.User) {
      context.commit("setUser", newUser);
      context.dispatch("dismissLogin");

      const resp = await Parse.Cloud.run("myTeams");
      await context.commit("setTeams", resp);
      await context.commit("setItems", resp.teams, {root: true});
      context.dispatch("refreshRoot", null, { root:true });

    },
    async fetchUser(context: any) {
      const user = await Parse.User.currentAsync();
      if(user) {
        context.dispatch("loggedIn", user);
      } else {
        context.dispatch("refreshRoot", null, { root:true });
      }
    },
    async setAvatar(context: any, f: Parse.File) {
      await f.save();
      const user = context.state.user;
      user.set("avatar", f);
      await user.save();
      context.commit("setUser", user);
    },
    async afterLogin(context: any) {
      if (context.getters["isLoggedIn"]) {
        // all good, continue
        return Promise.resolve(true)
      }

      await context.commit("setWantsToLogin", true);

      return new Promise((resolve, reject) => {
        const stopper = watch(
        () => [context.getters['user'], context.getters['wantsToLogin']],
        (newVals) => {
          console.log("new watch changes", newVals);
          if (newVals[0]) {
            // login happened
            resolve(true);
            stopper()
          } else if (!newVals[1]) {
            // closed without login
            reject("Didn't log in");
            stopper()
          }
        });
      });
    },
    async like(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("like", params);
        await context.commit("setItem", obj, { root:true });
      }, (e: string) => console.warn("Aborted liking: ", e))
    },
    async unlike(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("unlike", params);
        await context.commit("setItem", obj, { root:true });
      }, (e: string) => console.warn("Aborted unliking: ", e))
    },
    async react(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("react", params);
        await context.commit("setItem", obj, { root:true });
      }, (e: string) => console.warn("Aborted reacting: ", e))
    },
    async unreact(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("unreact", params);
        await context.commit("setItem", obj, { root:true });
      }, (e: string) => console.warn("Aborted unreacting: ", e))
    },
    async logShared(context: any, params: any) {
      const obj = await Parse.Cloud.run("logShared", params);
      await context.commit("setItem", obj, { root:true });
    },
  }
}

