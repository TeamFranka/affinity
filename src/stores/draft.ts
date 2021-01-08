import { Parse, Verb, Visibility } from "../config/Consts";
import { Picture, Activity, Poll } from "../db/models";
import { takePicture, CameraPhoto } from '../utils/camera';

// FROM https://stackoverflow.com/a/9284473
// eslint-disable-next-line no-useless-escape
const LINK_EXP = new RegExp('(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?', 'ig');

export interface Image {
  description: string | null;
  file: typeof CameraPhoto;
}
export interface Link {
  url: string;
  loading: boolean;
  title: string | null;
  description: string | null;
}


export interface DraftT {
  team: Parse.Object | null;
  text: string;
  verb: Verb;
  visibility: Visibility;
  images: Array<Image>;
  links: Array<Link>;
  polls: Array<typeof Poll>;
}

export const Draft = {
  namespaced: true,
  state: () => ({
    team: null,
    text: "",
    verb: Verb.Post,
    visibility: Visibility.Public,
    images: [],
    polls: [],
    links: []
  }),
  getters: {
    selectedTeam(state: DraftT, getters: any, rootState: any, rootGetters: any) {
      return state.team || rootGetters["defaultTeam"];
    },
    canSubmit(state: DraftT): boolean {
      return state.text.length > 0 || state.images.length > 0 || state.polls.length > 0
    },
    selectedType(state: DraftT) {
      return state.verb;
    },
    images(state: DraftT) {
      return state.images;
    },
    polls(state: DraftT)  {
      return state.polls;
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
    addImage(state: DraftT, img: Image) {
      state.images.push(img);
    },
    addPoll(state: DraftT, poll: Parse.Object) {
      state.polls.push(poll);
    },
    updatePoll(state: DraftT, input: any) {
      const index: number = input.index;
      const currentPoll = state.polls[index];
      Object.entries(input.data).forEach(([key, value]) => {
        currentPoll.set(key, value);
      });
      state.polls = Array.from(state.polls);
    },
    removePoll(state: DraftT, index: number) {
      state.polls.splice(index, 1);
      state.polls = Array.from(state.polls);
    },
    setTeam(state: DraftT, team: Parse.Object) {
      state.team = team;
    },
    async setText(state: DraftT, text: string) {
      state.text = text;
      console.log(text);
      for (const l of text.matchAll(LINK_EXP)) {
        let found = false;
        const url = l.toString();
        for (const link of state.links) {
          if (link.url == url) {
            found = true;
            break
          }
        }
        if (found) continue
        console.log(url);
        const res = await Parse.Cloud.run("fetchLinkMetadata", { url });
        console.log(res);
      }
    },
    setType(state: DraftT, t: Verb) {
      state.verb = t;
    },
    setVisibility(state: DraftT, v: Visibility) {
      state.visibility = v;
    },
    clear(state: DraftT) {
      state.images = [];
      state.polls = [];
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
      const team = state.team || context.rootGetters["defaultTeam"];
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
            visibility: state.visibility,
            description: entry.description,
            author, team, file,
          });
          objects.push(picture);
        }
      }

      state.polls.forEach((p: Parse.Object) => {
        p.set("team", team);
        p.set("author", author);
        objects.push(p)
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