import { Parse, Comment } from "../config/Consts";

export interface CommentT {
  objectId: string;
  comments: Array<CommentT>;
}

export interface CommentsState {
  loading: boolean;
  comments: Array<CommentT>;
}

export interface CommentsT {
  comments: Record<string, CommentsState>;
  drafs: Record<string, string>;
}

export const Comments = {
  namespaced: true,
  state: () => ({
    comments: {},
    drafts: {}
  }),
  mutations: {
    loadingComments(state: CommentsT, objectId: string) {
      const comst = state.comments[objectId] || {comments: []};
      comst.loading = true;
      state.comments[objectId] = comst;
    },
    setTree(state: CommentsT, res: any) {
      const objectId = res.objectId;
      const comments = res.comments;
      console.log("comments", objectId, comments);
      state.comments[objectId] = {comments, loading: false};
    },
  },
  actions: {
    async loadComments(context: any, ptr: Parse.Pointer) {
      console.log("fetching", ptr.objectId);
      context.commit("loadingComments", ptr.objectId);
      const comments = await (new Parse.Query(Comment))
        .equalTo("on.className", ptr.className)
        .equalTo("on.objectId", ptr.objectId)
        .include("author")
        .include("attachments")
        .ascending("createdAt")
        .find();

      console.log("comments", comments);
      if (!comments.length) {
        context.commit("setTree", {objectId: ptr.objectId, comments: []});
        return
      }


      const tl: Array<string> = [];
      const byParent: Record<string, Array<string>> = {};
      const objsToAdd: Record<string, Parse.Object> = {};

      comments.forEach((c: Parse.Object) => {
        const id: string = c.id
        const replyTo: Parse.Pointer = c.get("replyTo");
        const author: Parse.Object = c.get("author");

        objsToAdd[id] = c;
        objsToAdd[author.id] = author;
        (c.get("attachments") || []).forEach((a: any) => objsToAdd[a.id] = a);

        if (replyTo) {
          const l = byParent[replyTo.objectId] || [];
          l.push(id);
          byParent[replyTo.objectId] = l;
        } else {
          tl.push(id);
        }
      });

      const fetchChildren = (parentId: string): Array<CommentT> => (
        (byParent[parentId] || []).map((objectId: string) => ({
          objectId,
          comments: fetchChildren(objectId),
        }))
      );

      const tree = tl.map((objectId: string) => ({
        objectId,
        comments: fetchChildren(objectId),
      }));

      await context.dispatch("addItems", {items: Object.values(objsToAdd)}, { root: true });
      context.commit("setTree", {objectId: ptr.objectId, comments: tree});
    }
  },
}