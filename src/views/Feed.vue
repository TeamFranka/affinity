<template>
  <ion-page>
     <ion-fab vertical="bottom" horizontal="end" slot="fixed">
     <ion-fab-button  color="primary" v-if="canPost" @click="createPost(canPostInTeams)">
        <ion-icon size="small" :icon="editIcon"/>
     </ion-fab-button>
    </ion-fab>

    <ion-content data-cy="activity-feed">
      <div class="wrap">
        <ion-card v-if="canPost">
          <ion-card-content>
            <new-post :teams="canPostInTeams" />
          </ion-card-content>
        </ion-card>
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
          :loading-text="$t('generic.state.loadingMore')">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonSpinner, IonCard, IonCardContent,
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
  methods:{
    async createPost (canPostInTeams: any) {
      const popover = await modalController
        .create({
          component: NewPost,
           cssClass:'modalCss',
           componentProps: {
           teams:canPostInTeams,
           isPopup:true
          },
        });
      popover.present();
      const result = await popover.onDidDismiss();
      if (result.data) {
        console.log("result",result);
      }
    },
  },

  components: {
    IonContent, IonPage, IonSpinner, IonCard, IonCardContent,
    IonInfiniteScroll, IonInfiniteScrollContent,
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