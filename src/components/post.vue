<template>
<ion-card>
  <ion-card-header>
    <avatar :profile="author"/>
    <div class="ion-padding-start">
      <div>
        {{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></span>
      </div>
      <ion-note color="medium">{{since}}</ion-note>
    </div>
  </ion-card-header>
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
  <div class="ion-padding-top ion-padding-start">
    <ion-chip outline color="light">
      <ion-icon :icon="comments" size="small" />
      <ion-label>{{post.get("commentsCount")}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="share" size="small"/>
      <ion-label>{{post.get("sharesCount")}}</ion-label>
    </ion-chip>
    <ion-chip @click="toggleLike" outline :color="likedColor">
      <ion-icon :icon="like" size="small"/>
      <ion-label>{{post.get("likesCount") }}</ion-label>
    </ion-chip>
    <ion-chip outline v-for="r in reactions" :key="r.key">
      <ion-label slot="">{{r.key}}</ion-label>
      <ion-label>{{r.count}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="plus" size="small"/>
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

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse, dayjs } from "../config/Consts";

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
      comments: chatbubblesOutline,
      teamSplitter: arrowRedoOutline,
      like: heartOutline,
      share: arrowRedoOutline,
      plus: addOutline
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
    toggleLike() {
      if (this.hasLiked){
        this.store.dispatch("auth/unlike", Object.assign({}, this.post.toPointer()));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.post.toPointer()));
      }
    }
  },
  components: {
    IonCard, IonImg, IonChip, IonLabel, IonCardHeader,
    IonIcon, IonNote, Avatar
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
</style>