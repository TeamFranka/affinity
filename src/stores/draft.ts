import { Parse, Picture, Activity, Verb, Visibility } from "../config/Consts";
import { takePicture, CameraPhoto } from '../utils/camera';

export interface Image {
  description: string | null;
  file: typeof CameraPhoto;
}

export interface DraftT {
  team: Parse.Object | null;
  text: string;
  verb: Verb;
  visibility: Visibility;
  images: Array<Image>;
}

export const Draft = {
  namespaced: true,
  state: () => ({
    team: null,
    text: "",
    verb: Verb.Post,
    visibility: Visibility.Public,
    images:  [],
  }),
  getters: {
    selectedTeam(state: DraftT, getters: any, rootState: any, rootGetters: any) {
      return state.team || rootGetters["auth/defaultTeam"];
    },
    canSubmit(state: DraftT): boolean {
      return state.text.length > 0 || state.images.length > 0;
    },
    selectedType(state: DraftT) {
      return state.verb;
    },
    selectedTeamId(state: DraftT, getters: any): string {
      return getters.selectedTeam.id
    },
    selectedTeamPerms(state: DraftT, getters: any, rootState: any, rootGetters: any): any {
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
    showTypeSelector(state: DraftT, getters: any,): boolean {
      return getters.selectableTypes.length > 0
    },
  },
  mutations: {
    addImage(state: DraftT, img: Image) {
      state.images.push(img);
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
      state.images = [];
      state.text = "";
    },
  },
  actions: {
    addPicture(context: any) {
      takePicture().then((img: typeof CameraPhoto) => {
        context.commit("addImage", {file: img, description: ""});
      });
    },
    async submit(context: any) {
      const author = context.rootGetters['auth/userPtr'];
      const state =  context.state;
      const team = state.team || context.rootGetters["auth/defaultTeam"];
      const objects: Parse.Object[] = [];

      if (state.images.length > 0) {

        for (let i = 0; i < state.images.length; i++) {
          const entry: any = state.images[i];
          const f = entry.file;
          const file = new Parse.File("post_image."+f.format,
            { uri: f.dataUrl },
            "image/" + f.format
          );
          await file.save();
          const picture = new Picture({
            description: entry.description,
            author, team, file,
          });
          await picture.save();
          objects.push(picture.toPointer());
        }
      }

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