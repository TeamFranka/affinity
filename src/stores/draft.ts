import { Parse, Verb, Visibility } from "../config/Consts";
import { Picture, Activity, Poll, Link, Document } from "../db/models";
import { takePicture, CameraPhoto } from '../utils/camera';

// FROM https://stackoverflow.com/a/9284473
// eslint-disable-next-line no-useless-escape
const LINK_EXP = new RegExp('(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?', 'ig');

export interface DraftT {
  team: Parse.Object | null;
  text: string;
  verb: Verb;
  visibility: Visibility;
  objects: Array<Parse.Object>;
}

export const Draft = {
  namespaced: true,
  state: () => ({
    team: null,
    text: "",
    verb: Verb.Post,
    visibility: Visibility.Public,
    objects: [],
  }),
  getters: {
    selectedTeam(state: DraftT, getters: any, rootState: any, rootGetters: any) {
      return state.team || rootGetters["defaultTeam"];
    },
    canSubmit(state: DraftT): boolean {
      return state.text.length > 0 || state.objects.length > 0
    },
    selectedType(state: DraftT) {
      return state.verb;
    },
    objects(state: DraftT) {
      return state.objects;
    },
    selectedTeamId(state: DraftT, getters: any): string {
      return getters.selectedTeam.id
    },
    selectedTeamPerms(state: DraftT, getters: any, rootState: any): any {
      return rootState.auth.teamPermissions[getters.selectedTeamId]
    },
    selectableTypes(state: DraftT, getters: any): Verb[] {
      const perms = getters.selectedTeamPerms;
      const types = [];
      if (perms.canPost){
        types.push(Verb.Post);
      }
      if (perms.canPublish){
        types.push(Verb.Announce);
      }
      return types
    },
    selectableVisibility(state: DraftT, getters: any): Visibility[] {
      const perms = getters.selectedTeamPerms;
      const types = [Visibility.Public, Visibility.Members];
      if (perms.isMod) {
        types.push(Visibility.Mods);
      }
      if (perms.isLeader) {
        types.push(Visibility.Leaders);
      }
      return types
    },
    showTypeSelector(state: DraftT, getters: any,): boolean {
      return getters.selectableTypes.length > 0
    },
  },
  mutations: {
    addObject(state: DraftT, obj: Parse.Object) {
      state.objects.push(obj);
    },
    refreshObjects(state: DraftT) {
      state.objects = Array.from(state.objects);
    },
    updateObject(state: DraftT, input: any) {
      const index: number = input.index;
      const current = state.objects[index];
      Object.entries(input.data).forEach(([key, value]) => {
        current.set(key, value);
      });
      state.objects = Array.from(state.objects);
    },
    removeObject(state: DraftT, index: number) {
      state.objects.splice(index, 1);
      state.objects = Array.from(state.objects);
    },
    setTeam(state: DraftT, team: Parse.Object) {
      state.team = team;
    },
    setText(state: DraftT, text: string) {
      state.text = text;
    },
    setType(state: DraftT, t: Verb) {
      state.verb = t;
    },
    setVisibility(state: DraftT, v: Visibility) {
      state.visibility = v;
    },
    clear(state: DraftT) {
      state.objects = [];
      state.text = "";
    },
  },
  actions: {
    addPicture(context: any) {
      takePicture().then((img: typeof CameraPhoto) => {
        const picture = new Picture({ description: "", img });
        context.commit("addObject", picture);
      });
    },
    swapObjects(context: any, index: number) {
      const a = context.state.objects[index];
      const b = context.state.objects[index+1];
      context.state.objects.splice(index, 2, b, a);
      context.commit("refreshObjects");
    },
    async addLink(context: any, url: string) {
      const newLink = new Link({url, loading: true});
      context.commit("addObject", newLink);
      const res = await Parse.Cloud.run("fetchLinkMetadata", { url });
      newLink.set("title", res.ogTitle || res.title);
      newLink.set("siteName", res.ogSiteName);
      newLink.set("description", res.ogDescription);
      if (res.previewImage) {
        newLink.set("previewImage", res.previewImage);
        delete res.previewImage;
      }
      newLink.set("metadata", res)
      newLink.set("loading", false);
      context.commit("refreshObjects");
      // console.log(res);
    },
    async updateText(context: any, text: string) {
      context.commit("setText", text);
      if (!context.getters.selectedTeamPerms.canCreateLink) {
        return
      }
      for (const l of text.matchAll(LINK_EXP)) {
        let found = false;
        const url = l.toString();
        for (const o of context.state.objects) {
          if ((o.className == "Link" || o.className == "Document") && o.get("url") == url) {
            found = true;
            break
          }
        }
        if (found) continue
        context.dispatch("addLink", url);
      }
    },
    async submit(context: any) {
      const author = context.rootGetters['auth/userPtr'];
      const state =  context.state;
      const team = state.team || context.rootGetters["defaultTeam"];
      const objects: Parse.Object[] = state.objects.map((p: Parse.Object) => {
        if (p.className == "Picture") {
          const img = p.get("img");
          const file = new Parse.File(
            `post_image.${img.format}`,
            { uri: img.dataUrl },
            `image/${img.format}`);
          p.unset("img");
          p.set("file", file);
        }
        p.set("team", team);
        p.set("author", author);
        return p;
      });

      const activity = new Activity({
        visibility: state.visibility,
        text: state.text,
        verb: state.verb,
        author,
        team,
        objects,
      });
      await activity.save();

      context.commit("clear");
      context.dispatch("feed/refresh", null, {root: true});
    }
  }
};