<template>
<ion-card >
  <ion-card-header>
    <avatar :profile="author"/>
    <ion-label>
      <h2>{{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></span></h2>
    <ion-note color="medium">{{activity.createdAt}}</ion-note>
    </ion-label>
  </ion-card-header>
  <!-- FIX Rendering of items -->
  <ion-card-content v-for="obj in objects" :key="obj.id">
      <div  v-if="obj.className == 'Post'">
        {{obj.get('text')}}
      </div>
      <div  v-if="obj.className == 'Picture'">
        <ion-img :src="obj.get('file').url()" />
      </div>
      <ion-icon :icon="chatbubbles" /> {{obj.comments || 0}}
      <ion-icon :icon="share" /> {{obj.sharesCount || 0}}
      <ion-icon :icon="like" /> {{obj.likesCount || 0}}
      <ion-icon :icon="plus" />
  </ion-card-content>
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
  name: 'Activity',
  props: {
    activity: {
      type: Parse.Object,
      required: true
    },
    showTeam: Boolean,
  },

  setup() {
    const store = useStore();
    return {
      objs: computed(() => store.getters.objectsMap),
      chatbubbles, like: heartOutline, share: arrowRedoOutline, plus: addOutline
    }
  },
  computed: {
    author(): Parse.Object {
      const author = this.activity.get("author");
      if (author.isDataAvailable()) {
        return author;
      }
      return this.objs[author.id]
    },
    objects(): Parse.Object {
      return this.activity.get("objects").map((o: Parse.Object) => {
        console.log(o);
        if (o.isDataAvailable()) {
          return o;
        }
        return this.objs[o.id]
      })
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