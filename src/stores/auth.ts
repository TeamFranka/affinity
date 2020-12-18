
import { DEFAULT_COMMUNITY, Team, Parse } from '../config/Consts';

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Parse.User | null;
  teams: Array<any>;
  teamPermissions: object;
}

export const AuthState = {
  namespaced: true,
  setup: () => ({
    wantsToLogin: false,
    user: null
  }),
  getters: {
    myTeams: (state: AuthStateT) => state.teams,
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
      await f.save();
      const user = context.state.user;
      user.set("avatar", f);
      await user.save();
      context.commit("setUser", user);

    }
  }
}

