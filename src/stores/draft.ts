import { Parse, Verb, Visibility } from "@/config/Consts";
import { Activity, Message } from "@/db/models";
import { takePicture, Photo } from "@/utils/camera";
import { CreateModel } from "@/utils/model";
import getUrls from "get-urls";
export interface DraftT {
  team: Parse.Object | null;
  text: string;
  verb: Verb;
  visibility: Visibility;
  objects: Array<CreateModel>;
}

const convertObjects = (
    objects: Array<CreateModel>, attrs: any
): Parse.Object[] =>
  objects.map((p: CreateModel) => {
    if (p.className == "Picture") {
      const img = p.img;
      const file = new Parse.File(
        `post_image.${img.format}`,
        { uri: img.dataUrl },
        `image/${img.format}`
      );
      delete p.img;
      p.file = file;
    }
    delete p.loading;
    return p.toParse(attrs);
  }
);

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
    selectedTeam(
      state: DraftT,
      getters: any,
      rootState: any,
      rootGetters: any
    ) {
      return state.team || rootGetters["defaultTeam"];
    },
    canSubmit(state: DraftT): boolean {
      return state.text.length > 0 || state.objects.length > 0;
    },
    selectedType(state: DraftT) {
      return state.verb;
    },
    objects(state: DraftT) {
      return state.objects;
    },
    selectedTeamId(state: DraftT, getters: any): string {
      return getters.selectedTeam.objectId;
    },
    selectedTeamPerms(state: DraftT, getters: any, rootState: any): any {
      return rootState.auth.teamPermissions[getters.selectedTeamId];
    },
    selectableTypes(state: DraftT, getters: any): Verb[] {
      const perms = getters.selectedTeamPerms;
      const types = [];
      if (perms.canPost) {
        types.push(Verb.Post);
      }
      if (perms.canPublish) {
        types.push(Verb.Announce);
      }
      return types;
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
      return types;
    },
    showTypeSelector(state: DraftT, getters: any): boolean {
      return getters.selectableTypes.length > 1;
    },
  },
  mutations: {
    addObject(state: DraftT, obj: CreateModel) {
      state.objects.push(obj);
    },
    updateObject(state: DraftT, input: any) {
      const index: number = input.index;
      const current = state.objects[index];
      Object.assign(current, input.data);
      state.objects = Array.from(state.objects);
    },
    removeObject(state: DraftT, index: number) {
      state.objects.splice(index, 1);
      state.objects = Array.from(state.objects);
    },
    refreshObjects(state: DraftT) {
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
      takePicture().then((img: Photo) => {
        const picture = new CreateModel("Picture", { description: "", img });
        context.commit("addObject", picture);
      });
    },
    swapObjects(context: any, index: number) {
      const a = context.state.objects[index];
      const b = context.state.objects[index + 1];
      context.state.objects.splice(index, 2, b, a);
    },
    async addDocumentLink(context: any, url: string) {
      const newDoc = new CreateModel("Document", { url, loading: true });
      context.commit("addObject", newDoc);
      const res = await Parse.Cloud.run("fetchLinkMetadata", { url });
      newDoc.title = res.ogTitle || res.title;
      newDoc.provider = res.ogSiteName;
      newDoc.description = res.ogDescription;
      newDoc.metadata = res;
      newDoc.loading = false;
    },
    async addDocumentFile(context: any, input: File) {
      const upload = new Parse.File(input.name, input);
      upload.addMetadata("size", input.size);
      upload.addMetadata("type", input.type);
      const newDoc = new CreateModel("Document", { title: input.name, upload });
      context.commit("addObject", newDoc);
    },
    async addLink(context: any, url: string) {
      const newLink = new CreateModel("Link", { url, loading: true });
      context.commit("addObject", newLink);
      Parse.Cloud.run("fetchLinkMetadata", { url })
        .then((res) => {
          newLink.url = res.url;
          newLink.title = res.title;
          newLink.siteName = res.publisher;
          newLink.previewText = res.description;
          if (res.previewImage) {
            newLink.previewImage = res.previewImage;
            delete res.previewImage;
          }
          newLink.metadata = res;
          newLink.loading = false;
          context.commit("refreshObjects");
        })
        .catch((error) => {
          newLink.metadata = { error };
          newLink.loading = false;
          context.commit("refreshObjects");
        });
    },
    convertLinkToDocument(context: any, index: number) {
      const link = context.state.objects[index];
      context.state.objects[index] = new CreateModel("Document", {
        url: link.url,
        title: link.title,
        description: link.previewText,
        metadata: link.metadata,
        siteName: link.siteName,
      });
    },
    async updateText(context: any, text: string) {
      context.commit("setText", text);
      if (!context.getters.selectedTeamPerms.canCreateLink) {
        return;
      }
      const matches = getUrls(text);
      for (const l of matches) {
        let found = false;
        const url = l.toString().trim();
        for (let idx = 0; idx < context.state.objects.length; idx++) {
          const o = context.state.objects[idx];
          if (o.className == "Link" || o.className == "Document") {
            if (o.url == url) {
              found = true;
              break;
            } else if (url.startsWith(o.url)) {
              context.commit("removeObject", idx);
              break;
            }
          }
        }
        if (found) continue;
        context.dispatch("addLink", url);
      }
    },
    async sendAsMessage(context: any, conversationId: string) {
      const author = context.rootGetters["auth/userPtr"];
      const conv = context.rootGetters.objectsMap[conversationId];
      console.log(conv, conversationId);
      const team = conv.team;
      const ACL = conv.ACL;
      const conversation = conv.toPointer();
      const objects: Parse.Object[] = convertObjects(
        context.state.objects, {
          team, author, ACL
        }
      );
      const msg = new Message({
        conversation, text: context.state.text, author, objects
      });
      await msg.save();

      context.commit("clear");
    },
    async submit(context: any) {
      const author = context.rootGetters["auth/userPtr"];
      const state = context.state;
      const team = (
        state.team || context.rootGetters["defaultTeam"]
      ).toPointer();
      const objects: Parse.Object[] = convertObjects(state.objects, {team, author});

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
    },
  },
};
