import { Parse } from '../config/Consts';

// export interface TeamPermission {
//   isAdmin: boolean;
//   canPost: boolean;
// }

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
    user: null,
    teams: [],
    teamPermissions: {}
  }),
  getters: {
    isLoggedIn: (state: AuthStateT) => !!state.user,
    myId: (state: AuthStateT) => state.user?.id,
    defaultTeam: (state: AuthStateT) => state.teams[0],
    user: (state: AuthStateT) => state.user,
    userPtr: (state: AuthStateT) => state.user?.toPointer(),
    myTeams: (state: AuthStateT) => state.teams,
    teamPermissions: (state: AuthStateT) => state.teamPermissions,
    hasManyTeams: (state: AuthStateT) => state.teams.length > 1,
    postableTeams: (state: AuthStateT) =>  state.teams?.filter(t => t && state.teamPermissions[t.id].canPost) || [],
  },
  mutations: {
    setUser(state: AuthStateT, newUser: Parse.User|null) {
      state.user = newUser
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      state.wantsToLogin = wanna;
    },
    setTeams(state: AuthStateT, resp: any) {
      state.teams = resp.teams;
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
    openLogin(context: any) {
      context.commit("setWantsToLogin", true);
    },
    async fetchUser(context: any) {
      const user = await Parse.User.currentAsync();
      await context.commit("setUser", user);
      const resp = await Parse.Cloud.run("myTeams");
      await context.commit("setTeams", resp);
      const items: any[] = [];
      resp.teams.forEach( (t: Parse.Object)  => { items.push(t); items.push(t.get("settings")) });
      await context.commit("setItems", items, {root: true});
      context.dispatch("refreshRoot", null, { root:true });
    },
    async setAvatar(context: any, f: Parse.File) {
      await f.save();
      const user = context.state.user;
      user.set("avatar", f);
      await user.save();
      context.commit("setUser", user);
    },
    async like(context: any, params: any) {
      const obj = await Parse.Cloud.run("like", params);
      await context.commit("setItem", obj, { root:true });
    },
    async unlike(context: any, params: any) {
      const obj = await Parse.Cloud.run("unlike", params);
      await context.commit("setItem", obj, { root:true });
    },
    async react(context: any, params: any) {
      const obj = await Parse.Cloud.run("react", params);
      await context.commit("setItem", obj, { root:true });
    },
    async unreact(context: any, params: any) {
      const obj = await Parse.Cloud.run("unreact", params);
      await context.commit("setItem", obj, { root:true });
    },
    async logShared(context: any, params: any) {
      const obj = await Parse.Cloud.run("logShared", params);
      await context.commit("setItem", obj, { root:true });
    },
  }
}

