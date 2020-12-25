<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <ion-card v-if="canPost">
          <ion-card-content>
            <new-post :teams="canPostInTeams" @submit="submitPost($event)" />
          </ion-card-content>
        </ion-card>

        <ion-toggle color="light">Posts only</ion-toggle>

        <ion-spinner v-if="loading" name="dots"></ion-spinner>

        <transition-group name="list">
          <activity v-for="a in latestPosts" :activity="a" :key="a.id" />
        </transition-group>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonToggle, IonSpinner, IonCard, IonCardContent
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
      loading: computed(() => store.state.feed.loading),
      latestPosts: computed(() => store.getters["feed/latestPosts"]),
      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,
      teamSplitter: caretForwardOutline,
    }
  },
  components: {
    IonContent, IonPage, IonToggle, IonSpinner, IonCard, IonCardContent,
    NewPost, Activity
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