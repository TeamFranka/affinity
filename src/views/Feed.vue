<template>
  <ion-page>
    <ion-button class="edit-button" v-if="canPost" @click="createPost(canPostInTeams)" shape="round" size="small">
       <ion-icon size="small" :icon="editIcon"/>
    </ion-button>
    
    <ion-content data-cy="activity-feed">
      <div class="wrap">
        <ion-spinner v-if="loading" name="dots"></ion-spinner>

        <transition-group name="list">
          <activity
            v-for="activity in latestPosts"
            :showTeam="showTeams"
            :activity="activity"
            :key="activity.objectId"
          />
        </transition-group>
      </div>
      <ion-infinite-scroll
        @ionInfinite="loadMore($event)"
        threshold="5%"
      >
        <ion-infinite-scroll-content
          loading-spinner="crescent"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  modalController
} from '@ionic/vue';
import { chatbubbles, heartOutline, addOutline, mailOutline, caretForwardOutline,createOutline as editIcon } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import Activity from "../components/activity.vue";
import NewPost from "../components/new-post.vue";


export default defineComponent({
  name: 'Feed',
   methods:{
  async createPost (canPostInTeams) {
      const popover = await modalController
        .create({
          component: NewPost,
           cssClass:'modalCss',
           componentProps: {
           teams:canPostInTeams
          },
        });
      popover.present();
      const result = await popover.onDidDismiss();
      if (result.data) {
        console.log("result",result);
      }
    },
  },


  setup() {
    const store = useStore();
    return {
      canPostInTeams: computed(() => store.getters["auth/postableTeamIds"].map((id: string)=> store.getters.objectsMap[id])),
      canPost: computed(() => store.getters["auth/postableTeamIds"].length > 0),
      loading: computed(() => store.state.feed.loading),
      canLoadMore: computed(() => store.getters["feed/canLoadMore"]),
      latestPosts: computed(() => store.getters["feed/latestPosts"]),
      showTeams: computed(() => store.getters["auth/myTeams"].length > 1),
      loadMore: (ev: CustomEvent) => {
        console.log("we should load more", ev);
        store.dispatch("feed/loadMore").then(() => {(ev.target as any).complete()})
      },
      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,
      teamSplitter: caretForwardOutline, store,editIcon
    }
  },

  components: {
    IonContent, IonPage, IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent,
     Activity
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
.edit-button{
    height: 50px;
    position: relative;
    z-index: 1;
    top: 90%;
    left: 80%;
    border-radius: 50%;
    width: 50px;
}

</style>