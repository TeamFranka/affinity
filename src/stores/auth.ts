
import { Parse } from '../config/Consts';

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Parse.User | null;
}

export const AuthState = {
  namespaced: true,
  setup: () => ({
    wantsToLogin: false,
    user: null
  }),
  getters: {},
  mutations: {
    setUser(state: AuthStateT, newUser: Parse.User|null) {
      console.debug("Setting user to", newUser);
      state.user = newUser
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      console.log("wants to login");
      state.wantsToLogin = wanna;
    }
  },
  actions: {
    dismissLogin(context: any) {
      context.commit("setWantsToLogin", false);
    },
    openLogin(context: any) {
      context.commit("setWantsToLogin", true);
    },
    fetchUser(context: any) {
      Parse.User.currentAsync().then(user => {
        console.log('User object found', user);
        context.commit("setUser", user);
      }, err => {
        console.error('Error getting user', err);
      });
    }
  }
}

