import { Parse } from '@/config/Consts';
import { isPlatform } from '@ionic/vue';
import { Model, toModel } from '@/utils/model';
import { initInstallation } from '@/utils/setup';
import { watch } from 'vue';

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Model | null;
  installation: Model | null;
  teams: Array<string>;
  teamPermissions: Record<string, any>;
}

function currentUser(): Model | null {
  const u = Parse.User.current();
  return u ? toModel(u): null;
}

export const AuthState = {
  namespaced: true,
  state: () => ({
    wantsToLogin: false,
    user: currentUser(),
    teams: [],
    teamPermissions: {},
  }),
  getters: {
    isLoggedIn: (state: AuthStateT) => !!state.user,
    myId: (state: AuthStateT) => state.user?.objectId,
    defaultTeam: (state: AuthStateT, getters: any, rootState: any, rootGetters: any) => rootGetters["defaultTeam"],
    user: (state: AuthStateT) => state.user,
    wantsToLogin: (state: AuthStateT) => state.wantsToLogin,
    userPtr: (state: AuthStateT) => state.user?.toPointer(),
    myTeams: (state: AuthStateT, getters: any, rootState: any, rootGetters: any) => state
      .teams
      .map(x => rootGetters.objectsMap[x]),
    teamPointers: (state: AuthStateT, getters: any, rootState: any, rootGetters: any) => {
      const teams = state.teams.filter(x => !!x)
      if (!teams.length) {
        return [{
          __type: "Pointer",
          className: "Team",
          objectId: rootGetters.defaultTeamId
        }];
      }
      return teams.map((objectId: string) => ({ __type: "Pointer", className: "Team", objectId }));
    },
    teamPermissions: (state: AuthStateT) => state.teamPermissions,
    hasManyTeams: (state: AuthStateT) => state.teams.length > 1,
    postableTeams: (state: AuthStateT) =>  state.teams?.filter(t => t && state.teamPermissions[t].canPost) || [],
    adminOfTeams: (state: AuthStateT) =>  state.teams?.filter(t => t && state.teamPermissions[t].isAdmin) || [],
  },
  mutations: {
    setUser(state: AuthStateT, newUser: Model|null) {
      state.user = newUser
    },
    setInstallation(state: AuthStateT, installation: Model|null) {
      state.installation = installation
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      state.wantsToLogin = wanna;
    },
    setTeams(state: AuthStateT, resp: any) {
      state.teams = resp.teams.map((x: any) => x.id);
      state.teamPermissions = Object.assign(state.teamPermissions, resp.permissions);
    },
    addPermissions(state: AuthStateT, resp: any) {
      state.teamPermissions = Object.assign(state.teamPermissions, resp.permissions);
    }
  },
  actions: {
    init(context: any) {
      if (isPlatform('mobile')) {
        initInstallation().then(async (i: Parse.Installation) => {
          i.set("defaultTeamId", context.rootGetters["defaultTeamId"])
          await i.save()
          context.commit("setInstallation", toModel(i));
        });
      }
    },
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
      const userPointer = newUser.toPointer();
      if (context.state.installation && !context.state.user) {
        context.state.prepareSave({user: userPointer}).save(); // fire and forget
        context.state.installation.user = userPointer;
        context.commit("setInstallation", context.state.installation);
      }
      context.commit("setUser", toModel(newUser));
      context.dispatch("dismissLogin");

      const resp = await Parse.Cloud.run("myTeams");
      await context.commit("setItems", resp.teams, {root: true});
      await context.commit("setTeams", resp);
      context.dispatch("refreshRoot", null, { root:true });

    },
    async fetchUser(context: any) {
      const user = await Parse.User.currentAsync();
      if(user) {
        context.dispatch("loggedIn", toModel(user));
      } else {
        context.dispatch("refreshRoot", null, { root:true });
      }
    },
    async setAvatar(context: any, f: Parse.File) {
      await f.save();
      const user = context.state.user.prepareSave({"avatar": f}).toParse();
      await user.save();
      context.commit("setUser", toModel(user));
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
        await context.commit("setItem", toModel(obj), { root:true });
      }, (e: string) => console.warn("Aborted liking: ", e))
    },
    async unlike(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("unlike", params);
        await context.commit("setItem", toModel(obj), { root:true });
      }, (e: string) => console.warn("Aborted unliking: ", e))
    },
    async react(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("react", params);
        await context.commit("setItem", toModel(obj), { root:true });
      }, (e: string) => console.warn("Aborted reacting: ", e))
    },
    async unreact(context: any, params: any) {
      return context.dispatch("afterLogin").then(async () => {
        const obj = await Parse.Cloud.run("unreact", params);
        await context.commit("setItem", toModel(obj), { root:true });
      }, (e: string) => console.warn("Aborted unreacting: ", e))
    },
    async logShared(context: any, params: any) {
      const obj = await Parse.Cloud.run("logShared", params);
      await context.commit("setItem", toModel(obj), { root:true });
    },
  }
}

