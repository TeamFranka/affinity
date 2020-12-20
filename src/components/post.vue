<template>
<ion-card>
  <ion-card-header>
    <avatar :profile="author"/>
    <div class="ion-padding-start">
      <div>
        {{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitterIcon" /> <a href="">TeamFranka</a></span>
      </div>
      <ion-note color="medium">{{since}}</ion-note>
    </div>
  </ion-card-header>
  <div ref="doubleTapRef">
    <div class="ion-padding">
      {{ text }}
    </div>
    <!-- FIX Rendering of items -->
    <div v-for="obj in objects" :key="obj.id" class="ion-padding">
      <div v-if="obj.className == 'Post'">
        {{obj.text}}
      </div>
      <div  v-if="obj.className == 'Picture'">
        <ion-img :src="obj.get('file').url()" />
      </div>
    </div>
  </div>
  <div class="ion-padding-top ion-padding-start">
    <ion-chip outline color="light">
      <ion-icon :icon="commentsIcon" size="small" />
      <ion-label>{{post.get("commentsCount")}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="shareIcon" size="small"/>
      <ion-label>{{post.get("sharesCount")}}</ion-label>
    </ion-chip>
    <ion-chip @click="toggleLike" outline :color="likedColor">
      <ion-icon :icon="likeIcon" size="small"/>
      <ion-label>{{post.get("likesCount") }}</ion-label>
    </ion-chip>
    <ion-chip outline v-for="r in reactions" :key="r.key" @click="unreact(r.key)">
      <ion-label slot="">{{r.key}}</ion-label>
      <ion-label>{{r.count}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="plusIcon" size="small"/>
    </ion-chip>
  </div>
</ion-card>
</template>


<script lang="ts">
import {
  IonCard, IonImg, IonLabel, IonCardHeader,
  IonIcon, IonNote, IonChip,
} from '@ionic/vue';
import { chatbubblesOutline, heartOutline, addOutline, arrowRedoOutline } from 'ionicons/icons';
import { createGesture } from "@ionic/core";

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse, dayjs } from "../config/Consts";

const DOUBLE_CLICK_THRESHOLD = 500;

export default defineComponent({
  name: 'Post',
  props: {
    post: {
      type: Parse.Object,
      required: true
    },
    showTeam: Boolean,
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
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.post.get("likedBy") || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    author(): Parse.Object {
      const author = this.post.get("author");
      if (author.isDataAvailable()) {
        return author;
      }
      return this.objs[author.id]
    },
    since(): string {
      return dayjs(this.post.get("createdAt")).fromNow()
    },
    text(): string {
        return this.post.get("text") || ""
    },
    objects(): Parse.Object {
      return (this.post.get("attachments") || []).map(
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
      return Object.keys(this.post.get("reactions") || {}).map((key) => {
        const reactors = this.post.get("reactions")[key];
        return {
          key,
          color: reactors.indexOf(this.store.getters["auth/myId"]) === -1 ? "light" : "dark",
          count: reactors.length
        }
      })
    }
  },
  methods: {
    like() {
      this.store.dispatch("auth/like", Object.assign({}, this.post.toPointer()));
    },
    toggleLike() {
      if (this.hasLiked){
        this.store.dispatch("auth/unlike", Object.assign({}, this.post.toPointer()));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.post.toPointer()));
      }
    },
    react(reaction: string) {
      this.store.dispatch("auth/react", Object.assign({reaction}, this.post.toPointer()));
    },
    unreact(reaction: string) {
      this.store.dispatch("auth/unreact", Object.assign({reaction}, this.post.toPointer()));
    },
  },
  components: {
    IonCard, IonImg, IonChip, IonLabel, IonCardHeader,
    IonIcon, IonNote, Avatar
  },
  mounted() {
    const c: any = this.$refs.doubleTapRef;

    let lastOnStart = 0;

    const gesture = createGesture({
      el: c,
      gestureName: "double-tap-like",
      threshold: 0,
      onStart: () => {
        const now = Date.now();

        if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
          this.like()
          lastOnStart = 0;
        } else {
          lastOnStart = now;
        }
      }
    });

    gesture.enable();

  }
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
</style>