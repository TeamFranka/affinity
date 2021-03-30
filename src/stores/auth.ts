import { Parse } from "@/config/Consts";
import { isPlatform } from "@ionic/vue";
import { Model, toModel } from "@/utils/model";
import { initInstallation } from "@/utils/setup";
import { getCypressEntry } from "@/utils/env";
import { watch } from "vue";
import { deviceLocale } from "@/utils/setup";
import { dayjs } from "@/config/Consts";
import i18n from "@/utils/i18n";

export interface AuthStateT {
  wantsToLogin: boolean;
  user: Model | null;
  installations: Model[];
  currentInstallationId: string | null;
  teams: Array<string>;
  teamPermissions: Record<string, any>;
}

function currentUser(): Model | null {
  const u = Parse.User.current();
  return u ? toModel(u) : null;
}

function setLocale(locale: string) {
  if (!locale) return;
  const lang = locale.split("-", 1)[0];
  i18n.global.locale.value = lang;
  dayjs.locale(lang);
}

export const AuthState = {
  namespaced: true,
  state: () => {
    const user = currentUser();
    if (user && user.lang) {
      setLocale(user.lang);
    } else {
      deviceLocale().then((l: string) => {
        setLocale(l);
      });
    }

    return {
      wantsToLogin: false,
      user,
      teams: [],
      installations: [],
      currentInstallationId: null,
      teamPermissions: {},
    };
  },
  getters: {
    isLoggedIn: (state: AuthStateT) => !!state.user,
    myId: (state: AuthStateT) => state.user?.objectId,
    settings: (state: AuthStateT) => state.user?.settings || {},
    defaultTeam: (
      state: AuthStateT,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => rootGetters["defaultTeam"],
    user: (state: AuthStateT) => state.user,
    wantsToLogin: (state: AuthStateT) => state.wantsToLogin,
    userPtr: (state: AuthStateT) => state.user?.toPointer(),
    myTeams: (
      state: AuthStateT,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => state.teams.map((x) => rootGetters.objectsMap[x]),
    teamPointers: (
      state: AuthStateT,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const teams = state.teams.filter((x) => !!x);
      if (!teams.length) {
        return [
          {
            __type: "Pointer",
            className: "Team",
            objectId: rootGetters.defaultTeamId,
          },
        ];
      }
      return teams.map((objectId: string) => ({
        __type: "Pointer",
        className: "Team",
        objectId,
      }));
    },
    teamPermissions: (state: AuthStateT) => state.teamPermissions,
    hasManyTeams: (state: AuthStateT) => state.teams.length > 1,
    postableTeamIds: (state: AuthStateT) =>
      state.teams?.filter((t) => t && state.teamPermissions[t].canPost) || [],
    adminOfTeams: (state: AuthStateT) =>
      state.teams?.filter((t) => t && state.teamPermissions[t].isAdmin) || [],

    // Devices // Installations
    hasPush: (state: AuthStateT) => state.installations.length > 0,
    currentInstallation: (state: AuthStateT) =>
      state.installations.find(
        (x) => x.installationId === state.currentInstallationId
      ),
    otherInstallations: (state: AuthStateT) =>
      state.installations.filter(
        (x) => x.installationId !== state.currentInstallationId
      ),
  },
  mutations: {
    setUser(state: AuthStateT, newUser: Model | null) {
      state.user = newUser;
      if (newUser && newUser.lang) {
        setLocale(newUser.lang);
      }
    },
    setInstallations(state: AuthStateT, installations: Model[]) {
      state.installations = installations;
    },
    setInstallationId(state: AuthStateT, installationId: string | null) {
      state.currentInstallationId = installationId;
    },
    updateInstallation(state: AuthStateT, installation: Model) {
      const idx = state.installations.findIndex(
        (i: Model) => i.id == installation.id
      );
      if (idx === -1) {
        state.installations.push(installation);
      } else {
        state.installations.splice(idx, 1, installation);
      }
    },
    setWantsToLogin(state: AuthStateT, wanna: boolean) {
      state.wantsToLogin = wanna;
    },
    setTeams(state: AuthStateT, resp: any) {
      state.teams = resp.teams.map((x: any) => x.id);
      state.teamPermissions = Object.assign(
        state.teamPermissions,
        resp.permissions
      );
    },
    addPermissions(state: AuthStateT, resp: any) {
      state.teamPermissions = Object.assign(
        state.teamPermissions,
        resp.permissions
      );
    },
  },
  actions: {
    init(context: any) {
      if (getCypressEntry("isMobile") || isPlatform("mobile")) {
        initInstallation().then(async (i: Parse.Installation) => {
          context.commit(
            "setInstallationId",
            i.get("installationId").toLowerCase()
          );
          const params: any = i.toJSON();
          params.defaultTeamId = context.rootGetters["defaultTeamId"];
          Parse.Cloud.run("claimInstallation", params).then(
            (i: Array<Parse.Installation>) => {
              context.commit("setInstallations", i.map(toModel));
            }
          );
        });
      } else if (context.state.user) {
        Parse.Cloud.run("getInstallations", {}).then(
          (i: Array<Parse.Installation>) => {
            context.commit("setInstallations", i.map(toModel));
          }
        );
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
    async updateInstallation(context: any, installationUpdate: Parse.Object) {
      await installationUpdate.save();
      const model = toModel(installationUpdate);
      context.commit("updateInstallation", model);
    },
    async loggedIn(context: any, newUser: Parse.User) {
      const userPointer = newUser.toPointer();
      if (context.getters.currentInstallation && !context.state.user) {
        const i = context.getters.currentInstallation.prepareSave({
          user: userPointer,
          setTeams: true,
        });
        // fire and forget
        Parse.Cloud.run("claimInstallation", i.toJSON()).then(
          (response: any) => {
            context.commit("setInstallations", response.map(toModel));
          }
        );
      }
      context.commit("setUser", toModel(newUser));
      context.dispatch("dismissLogin");

      const resp = await Parse.Cloud.run("myTeams");
      await context.commit("setItems", resp.teams, { root: true });
      await context.commit("setTeams", resp);
      context.dispatch("refreshRoot", null, { root: true });
    },
    async fetchUser(context: any) {
      const user = await Parse.User.currentAsync();
      if (user) {
        context.dispatch("loggedIn", toModel(user));
      } else {
        context.dispatch("refreshRoot", null, { root: true });
      }
    },
    async setAvatar(context: any, f: Parse.File) {
      await f.save();
      const user = context.state.user.prepareSave({ avatar: f }).toParse();
      await user.save();
      context.commit("setUser", toModel(user));
    },
    async setLang(context: any, lang: string) {
      const user = context.state.user.prepareSave({ lang }).toParse();
      await user.save();
      context.commit("setUser", toModel(user));
    },
    async setSetting(context: any, updates: any) {
      const settings = Object.assign({}, context.state.user.settings, updates);
      const user = context.state.user.prepareSave({ settings }).toParse();
      await user.save();
      context.commit("setUser", toModel(user));
    },
    async afterLogin(context: any) {
      if (context.getters["isLoggedIn"]) {
        // all good, continue
        return Promise.resolve(true);
      }

      await context.commit("setWantsToLogin", true);

      return new Promise((resolve, reject) => {
        const stopper = watch(
          () => [context.getters["user"], context.getters["wantsToLogin"]],
          (newVals) => {
            if (newVals[0]) {
              // login happened
              resolve(true);
              stopper();
            } else if (!newVals[1]) {
              // closed without login
              reject("Didn't log in");
              stopper();
            }
          }
        );
      });
    },
    async like(context: any, params: any) {
      return context.dispatch("afterLogin").then(
        async () => {
          const obj = await Parse.Cloud.run("like", params);
          await context.commit("setItem", toModel(obj), { root: true });
        },
        (e: string) => console.warn("Aborted liking: ", e)
      );
    },
    async unlike(context: any, params: any) {
      return context.dispatch("afterLogin").then(
        async () => {
          const obj = await Parse.Cloud.run("unlike", params);
          await context.commit("setItem", toModel(obj), { root: true });
        },
        (e: string) => console.warn("Aborted unliking: ", e)
      );
    },
    async react(context: any, params: any) {
      return context.dispatch("afterLogin").then(
        async () => {
          const obj = await Parse.Cloud.run("react", params);
          await context.commit("setItem", toModel(obj), { root: true });
        },
        (e: string) => console.warn("Aborted reacting: ", e)
      );
    },
    async unreact(context: any, params: any) {
      return context.dispatch("afterLogin").then(
        async () => {
          const obj = await Parse.Cloud.run("unreact", params);
          await context.commit("setItem", toModel(obj), { root: true });
        },
        (e: string) => console.warn("Aborted unreacting: ", e)
      );
    },
    async logShared(context: any, params: any) {
      const obj = await Parse.Cloud.run("logShared", params);
      await context.commit("setItem", toModel(obj), { root: true });
    },
  },
};
