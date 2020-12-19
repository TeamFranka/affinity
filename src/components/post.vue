<template>
<ion-card >
  <ion-card-header>
    <avatar :profile="author"/>
    <ion-label>
      <h2>{{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></span></h2>
    <ion-note color="medium">{{post.createdAt}}</ion-note>
    </ion-label>
  </ion-card-header>
  <ion-card-content>
    {{ text }}
  </ion-card-content>
  <!-- FIX Rendering of items -->
  <ion-card-content v-for="obj in objects" :key="obj.id">
      <div v-if="obj.className == 'Post'">
        {{obj.text}}
      </div>
      <div  v-if="obj.className == 'Picture'">
        <ion-img :src="obj.get('file').url()" />
      </div>
  </ion-card-content>
  <div>
      <ion-icon :icon="chatbubbles" /> {{post.commentsCount || 0}}
      <ion-icon :icon="share" /> {{post.sharesCount || 0}}
      <ion-icon :icon="like" /> {{post.likesCount || 0}}
      <ion-icon :icon="plus" />
  </div>
</ion-card>
</template>


<script lang="ts">
import {
  IonCard,IonCardContent, IonCardHeader, IonImg,
  IonIcon, IonLabel, IonNote,
} from '@ionic/vue';
import { chatbubbles, heartOutline, addOutline, mailOutline, arrowRedoOutline } from 'ionicons/icons';

import Parse from "parse";
import Avatar from "./avatar.vue";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';

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
      chatbubbles,
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
    IonCard,IonCardContent, IonCardHeader, IonImg,
    IonIcon, IonLabel, IonNote, Avatar
  },
});
</script>
<style scoped>
</style>