<template>
<ion-card>
  <ion-card-header>
    <div class="avatar-wrap">
      <avatar :profile="author" v-if="showAuthor"/>
      <div v-if="!showAuthor">
        <router-link :to="teamLink"><avatar :profile="teamSettings" :name="teamName" v-if="!showAuthor"/></router-link>
      </div>
    </div>
    <div class="ion-padding-start">
      <div v-if="showAuthor">
        {{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitterIcon" /> <router-link :to="teamLink">{{teamName}}</router-link
        ></span>
      </div>
      <div v-if="!showAuthor">
        <router-link :to="teamLink">{{teamName}}</router-link>
      </div>
      <router-link :to="link">
          <ion-note color="medium">{{since}}</ion-note>
        </router-link>
    </div>
  </ion-card-header>
  <div ref="doubleTapRef">
    <div class="ion-padding">
      {{ text }}
    </div>
    <!-- FIX Rendering of items -->
    <div v-for="obj in objects" :key="obj.id" class="ion-padding">
      <div v-if="obj.className == 'activity'">
        {{obj.text}}
      </div>
      <div  v-if="obj.className == 'Picture'">
        <ion-img :src="obj.get('file').url()" />
      </div>
    </div>
  </div>
  <div class="ion-padding-top ion-padding-start">
    <ion-chip @click="toggleComments()" outline :color="showComments ? 'dark':'light'">
      <ion-icon :icon="commentsIcon" size="small" />
      <ion-label>{{activity.get("commentsCount")}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <share-button
        :link="fullLink"
        :pointer="pointer"
        :counter="activity.get('sharesCount') || 0"
      />
    </ion-chip>
    <ion-chip @click="toggleLike" outline :color="likedColor">
      <ion-icon :icon="likeIcon" size="small"/>
      <ion-label>{{activity.get("likesCount") }}</ion-label>
    </ion-chip>
    <reactions :item="activity" />
  </div>
  <div v-if="showComments">
    <ion-spinner v-if="commentsLoading" />
    <inline-text
      :value="draft"
      :canSubmit="!!(draft && draft.length >= 3)"
      placeholder="comment here"
      @submit="submitComment()"
      @changed="setDraft($event)"
    />
    <ion-grid>
      <comment
        v-for="c in comments"
        :commentId="c.objectId"
        :key="c.oobjectId"
        :children="c.comments"
        :object="pointer"
      />
    </ion-grid>
  </div>
</ion-card>
</template>
<script lang="ts">
import {
  IonCard, IonImg, IonLabel, IonCardHeader, IonSpinner,
  IonIcon, IonNote, IonChip, IonGrid,
} from '@ionic/vue';
import { chatbubblesOutline, heartOutline, addOutline, arrowRedoOutline } from 'ionicons/icons';

import Avatar from "./avatar.vue";
import InlineText from "./inline-text.vue";
import ShareButton from "./share-button.vue";
import Reactions from "./reactions.vue";
import Comment from "./comment.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse } from "../config/Consts";
import { doubleTapGesture } from "../utils/gestures";
import { since } from "../utils/time";

export default defineComponent({
  name: 'Activity',
  props: {
    activity: {
      type: Parse.Object,
      required: true
    },
    showTeam: Boolean,
    startCommentsOpen: Boolean,
  },
  data(props) {
    return {
      showComments: props.startCommentsOpen,
      comment: ""
    }
  },
  setup() {
    const store = useStore();
    return {
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon: chatbubblesOutline,
      teamSplitterIcon: arrowRedoOutline,
      likeIcon: heartOutline,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline
    }
  },
  computed: {
    link(): string {
      return '/a/' + this.activity.id
    },
    fullLink(): string {
      return process.env.BASE_URL + this.link;
    },
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.activity.get("likedBy") || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    team(): Parse.Object {
      const team = this.activity.get("team");
      if (team.isDataAvailable()) {
        return team;
      }
      return this.objs[team.id]
    },
    teamSettings(): Parse.Object {
      const settings = this.team.get("settings");
      if (settings.isDataAvailable()) {
        return settings;
      }
      return this.objs[settings.id]
    },
    teamName(): string {
      return this.team.get("name")
    },
    teamLink(): string {
      return '/t/' + this.team.get("slug")
    },
    showAuthor(): boolean {
      if (this.activity.get("verb") == "announce") {
        // announcement show the team as author
        return false
      }
      return true
    },
    author(): Parse.Object {
      const author = this.activity.get("author");
      if (author.isDataAvailable()) {
        return author;
      }
      return this.objs[author.id]
    },
    since(): string {
      return since(this.activity.get("createdAt"))
    },
    text(): string {
        return this.activity.get("text") || ""
    },
    objects(): Parse.Object {
      return (this.activity.get("objects") || []).map(
            (o: Parse.Object) => this.objs[o.id])
    },
    pointer(): Parse.Pointer {
      return this.activity.toPointer()
    },
    draft(): string {
      const d = this.store.state.comments.drafts[this.activity.id];
      if (d) {
        return d[""]
      }
      return ""
    },
    commentsLoading(): boolean {
      const s = this.store.state.comments.comments[this.activity.id];
      if (s) {
        return s.loading
      }
      return false
    },
    comments(): Array<any> {
      const s = this.store.state.comments.comments[this.activity.id];
      if (s) {
        return s.comments
      }
      return []
    },
    likedColor(): string {
      return this.hasLiked ? "danger" : "light"
    },
    authorName(): string {
      const author = this.author;
      return author.get("name") || author.get("username")
    },
  },
  methods: {
    async toggleComments() {
      if (this.showComments) {
        this.showComments = false;
        return
      }
      await this.store.dispatch("comments/loadComments", this.activity.toPointer());
      this.showComments = true;
    },
    setDraft(text: string) {
      this.store.commit("comments/setDraft", {
        objectId: this.activity.id,
        text
      });
    },
    submitComment(){
      const text = this.comment;
      console.log("submitting", text);
      this.store.dispatch("comments/submitDraft", {
        ptr: this.activity.toPointer(),
        text
      });
    },
    like() {
      this.store.dispatch("auth/like", Object.assign({}, this.pointer));
    },
    toggleLike() {
      if (this.hasLiked){
        this.store.dispatch("auth/unlike", Object.assign({}, this.pointer));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.pointer));
      }
    },
  },
  components: {
    IonCard, IonImg, IonChip, IonLabel, IonCardHeader, IonSpinner, Comment,
    IonIcon, IonNote, Avatar, IonGrid, InlineText, ShareButton, Reactions
  },
  mounted() {
    const c: any = this.$refs.doubleTapRef;
    doubleTapGesture(c, () => this.like());
  }
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
.avatar-wrap {
  width: 5em;
}
</style>