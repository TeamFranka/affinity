<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-toggle color="light">Posts only</ion-toggle>
      <new-post :teams="canPostInTeams" @submit="submitPost($event)" v-if="canPost" />
      <activity v-for="a in activities" :activity="a" :key="a.id" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonToggle,
} from '@ionic/vue';
import { chatbubbles, heartOutline, addOutline, mailOutline, caretForwardOutline } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import Activity from "../components/activity.vue";
import NewPost from "../components/new-post.vue";


export default defineComponent({
  name: 'Feed',
  setup() {
    const store = useStore();
    return {
      canPostInTeams: computed(() => store.getters["auth/postableTeams"]),
      canPost: computed(() => store.getters["auth/postableTeams"].length > 0),
      activities: computed(() => store.getters["feed/activities"]),
      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,
      teamSplitter: caretForwardOutline,
    }
  },
  components: {
    IonContent, IonPage, IonToggle, NewPost, Activity
  }
});
</script>

<style scoped>
ion-card img.image {
  width: 100%;
}

ion-card-header {
  display: flex;
  align-content: center;
}
ion-card-header ion-avatar {
  height: 3em;
  width: 3em;
}
ion-card-header ion-label {
  padding-left: 1em;
}
</style>