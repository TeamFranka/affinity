import { Parse, Picture, Activity, Verb } from "../config/Consts";
import { takePicture, CameraPhoto } from '../utils/camera';

export interface Image {
  description: string | null;
  file: typeof CameraPhoto;
}

export interface DraftT {
  team: Parse.Object | null;
  text: string;
  verb: Verb;
  images: Array<Image>;
}

export const Draft = {
  namespaced: true,
  state: () => ({
    team: null,
    text: "",
    verb: Verb.Post,
    images:  [],
  }),
  getters: {
    canSubmit(state: DraftT): boolean {
      return state.text.length > 0 || state.images.length > 0;
    }
  },
  mutations: {
    addImage(state: DraftT, img: Image) {
      state.images.push(img);
      console.log(state.images);
    },
    setTeam(state: DraftT, team: Parse.Object) {
      state.team = team;
    },
    setText(state: DraftT, text: string) {
      state.text = text;
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
      console.log("author", author, "team", team);
      const objects: Parse.Object[] = [];

      if (state.images.length > 0) {

        for (let i = 0; i < state.images.length; i++) {
          const entry: any = state.images[i];
          const f = entry.file;
          console.log("f", f);
          const file = new Parse.File("post_image."+f.format,
            { uri: f.dataUrl },
            "image/" + f.format
          );
          console.log("file", file);
          await file.save();
          const picture = new Picture({
            description: entry.description,
            author, team, file,
          });
          console.log("picture", picture, picture.get("file"));
          await picture.save();
          objects.push(picture.toPointer());
        }
      }

      const activity = new Activity({text: state.text, verb:state.verb, author, team, objects});
      await activity.save();

      context.commit("clear");
      context.dispatch("feed/refresh", null, {root: true});
    }
  }
};