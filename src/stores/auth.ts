
import { State } from 'ionicons/dist/types/stencil-public-runtime';
import { Parse } from '../config/Consts';

export interface TeamPermission {
  isAdmin: boolean;
  canPost: boolean;
}

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Parse.User | null;
  teams: Array<Parse.Object>;
  teamPermissions: Record<string, TeamPermission>;
}

export const AuthState = {
  namespaced: true,
  state: () => ({
    wantsToLogin: false,
    user: null,
    teams: [],
  }),
  getters: {
    defaultTeam: (state: AuthStateT) => state.teams[0],
    user: (state: AuthStateT) => state.user,
    userPtr: (state: AuthStateT) => state.user?.toPointer(),
    myTeams: (state: AuthStateT) => state.teams,
    hasManyTeams: (state: AuthStateT) => state.teams.length > 1,
    postableTeams: (state: AuthStateT) => state.teams?.filter(t => state.teamPermissions[t.id].canPost) || [],
  },
  mutations: {
    setUser(state: AuthStateT, newUser: Parse.User|null) {
      console.debug("Setting user to", newUser);
      state.user = newUser
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      console.log("wants to login");
      state.wantsToLogin = wanna;
    },
    setTeams(state: AuthStateT, resp: any) {
      console.log("setting teams:", resp);
      state.teams = resp.teams;
      state.teamPermissions = resp.permissions;
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
      console.log('User object found', user);
      await context.commit("setUser", user);
      const resp = await Parse.Cloud.run("myTeams");
      await context.commit("setTeams", resp);
      context.dispatch("refreshRoot", null, { root:true });
    },
    async setAvatar(context: any, f: Parse.File)  {
      console.log("about to set", f);
      await f.save();
      console.log("saved and setting", f);
      const user = context.state.user;
      user.set("avatar", f);
      await user.save();
      context.commit("setUser", user);
    }
  }
}

