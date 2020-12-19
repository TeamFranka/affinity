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
      <ion-label>{{post.commentsCount || 0}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="share" size="small"/>
      <ion-label>{{post.sharesCount || 0}}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <ion-icon :icon="like" size="small"/>
      <ion-label>{{post.likesCount || 0}}</ion-label>
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
      comments: chatbubblesOutline,
      teamSplitter: arrowRedoOutline,
      like: heartOutline,
      share: arrowRedoOutline,
      plus: addOutline
    }
  },
  computed: {
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
    authorName(): string {
      const author = this.author;
      return author.get("name") || author.get("username")
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