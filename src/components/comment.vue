<template>
  <ion-row ref="doubleTapRef">
    <ion-col size="1">
      <avatar :profile="author"/>
    </ion-col>
    <ion-col size="10">
      <div> {{authorName}} <ion-note color="medium">{{since}}</ion-note>
      </div>
      <div>
          {{ text }}
      </div>
      <div>
        <ion-chip @click="toggleLike" outline size="small" :color="likedColor">
          <ion-icon :icon="likeIcon" size="small"/>
          <ion-label>{{comment.get("likesCount") }}</ion-label>
        </ion-chip>
        <ion-chip outline v-for="r in reactions" :key="r.key" @click="unreact(r.key)">
          <ion-label>{{r.key}}</ion-label>
          <ion-label>{{r.count}}</ion-label>
        </ion-chip>
        <ion-chip outline color="light">
          <ion-icon :icon="plusIcon" size="small"/>
        </ion-chip>
      </div>
    </ion-col>
    <ion-col size="1">
      <ion-chip @click="showInput = !showInput" outline color="light">
        <ion-icon :icon="replyIcon" size="small"/>
      </ion-chip>
    </ion-col>
    <ion-col offset="1" size="11">
      <inline-text
        v-if="showInput"
        :value="draft"
        :canSubmit="!!(draft && draft.length >= 3)"
        placeholder="comment here"
        @submit="submitComment()"
        @changed="setDraft($event)"
      />
      <comment
        v-for="c in children"
        :children="c.comments"
        :key="c.objectId"
        :commentId="c.objectId"
        :object="object"
      />
    </ion-col>
  </ion-row>
</template>


<script lang="ts">
import {
  IonCol, IonRow, IonImg, IonLabel, IonSpinner,
  IonIcon, IonNote, IonChip,
} from '@ionic/vue';
import {
  chatbubblesOutline, heartOutline, addOutline, arrowRedoOutline, arrowUndoOutline
} from 'ionicons/icons';
import { createGesture } from "@ionic/core";

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse, dayjs } from "../config/Consts";
import InlineText from './inline-text.vue';

export default defineComponent({
  name: 'Comment',
  props: {
    object:  {
      type: Object,
      required: true
    },
    commentId: {
      type: String,
      required: true
    },
    inset: Boolean,
    children: {
      type: Array
    },
  },
  data() {
    return {
        showInput: false,
    }
  },
  setup(props) {
    const store = useStore();
    return {
      comment: computed(() => store.getters.objectsMap[props.commentId]),
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon: chatbubblesOutline,
      teamSplitterIcon: arrowRedoOutline,
      likeIcon: heartOutline,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline,
      replyIcon: arrowUndoOutline,
    }
  },
  computed: {
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.comment.get("likedBy") || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    author(): Parse.Object {
      const author = this.comment.get("author");
      if (author.isDataAvailable()) {
        return author;
      }
      return this.objs[author.id]
    },
    since(): string {
      return dayjs(this.comment.get("createdAt")).fromNow()
    },
    text(): string {
        return this.comment.get("text") || ""
    },
    draft(): string {
      const d = this.store.state.comments.drafts[this.object.objectId];
      if (d) {
        return d[this.commentId]
      }
      return ""
    },
    objects(): Parse.Object {
      return (this.comment.get("attachments") || []).map(
            (o: Parse.Object) => this.objs[o.id])
    },
    likedColor(): string {
      return this.hasLiked ? "danger" : "light"
    },
    authorName(): string {
      const author = this.author;
      return author.get("name") || author.get("username")
    },
    reactions(): Array<any> {
      return Object.keys(this.comment.get("reactions") || {}).map((key) => {
        const reactors = this.comment.get("reactions")[key];
        return {
          key,
          color: reactors.indexOf(this.store.getters["auth/myId"]) === -1 ? "light" : "dark",
          count: reactors.length
        }
      })
    }
  },
  methods: {
    setDraft(text: string) {
      console.log("setting draft", text);
      this.store.commit("comments/setDraft", {
        objectId: this.object.objectId,
        replyTo: this.commentId,
        text
      });
    },
    submitComment(){
      this.store.dispatch("comments/submitDraft", {
        ptr: this.object,
        replyTo: this.comment.toPointer(),
      });
    },
    like() {
      this.store.dispatch("auth/like", Object.assign({}, this.comment.toPointer()));
    },
    toggleLike() {
      if (this.hasLiked){
        this.store.dispatch("auth/unlike", Object.assign({}, this.comment.toPointer()));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.comment.toPointer()));
      }
    },
    react(reaction: string) {
      this.store.dispatch("auth/react", Object.assign({reaction}, this.comment.toPointer()));
    },
    unreact(reaction: string) {
      this.store.dispatch("auth/unreact", Object.assign({reaction}, this.comment.toPointer()));
    },
  },
  components: {
    IonRow, IonChip, IonLabel, IonCol, InlineText,
    IonIcon, IonNote, Avatar,
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
</style>