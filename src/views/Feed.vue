<template>
  <ion-page>
    <team-filter-header @team-selected="selectTeam($event)"/>

    <ion-fab class="ion-hide-sm-up" vertical="bottom" horizontal="end" slot="fixed"  v-if="canPost">
      <ion-fab-button data-cy="openNewPostModal" color="primary" @click="openNewPostModal()">
        <ion-icon size="small" :icon="editIcon"/>
      </ion-fab-button>
    </ion-fab>

    <ion-content data-cy="activity-feed">
      <div class="wrap">
        <ion-card class="ion-hide-sm-down" v-if="canPost">
          <ion-card-content>
            <new-post :can-change-visiblity="true" :teams="canPostInTeams" />
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
      <ion-infinite-scroll @ionInfinite="loadMore($event)" threshold="5%">
        <ion-infinite-scroll-content
          loading-spinner="crescent"
          :loading-text="$t('generic.state.loadingMore')"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonIcon,
  modalController
} from '@ionic/vue';
import {
  chatbubbles,
  heartOutline,
  addOutline,
  mailOutline,
  caretForwardOutline,
  createOutline as editIcon
  } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import Activity from "../components/activity.vue";
import TeamFilterHeader from "../components/team-filter-header.vue";
import NewPost from "../components/new-post.vue";
import NewPostModal from "../components/new-post-modal.vue";

export default defineComponent({
  name: 'Feed',
  setup() {
    const store = useStore();
    return {
      canPostInTeams: computed(() =>
        store.getters["auth/postableTeamIds"].map(
          (id: string) => store.getters.objectsMap[id]
        )
      ),
      canPost: computed(() => store.getters["auth/postableTeamIds"].length > 0),
      teamName: computed(() => store.getters["auth/myTeams"]),
      loading: computed(() => store.getters["feed/loading"]),
      canLoadMore: computed(() => store.getters["feed/canLoadMore"]),
      latestPosts: computed(() => store.getters["feed/latestPosts"]),
      showTeams: computed(() => store.getters["auth/myTeams"].length > 1 && !store.state.feed.selectedTeam),
      selectTeam: async (name: string) => {
        await store.dispatch("feed/selectTeam", name === "ALL" ? null : name);
      },
      loadMore: (ev: CustomEvent) => {
        store.dispatch("feed/loadMore").then(() => {
          (ev.target as any).complete();
        });
      },
      chatbubbles,
      like: heartOutline,
      mail: mailOutline,
      plus: addOutline,
      teamSplitter: caretForwardOutline,
      store,
      editIcon,
    }
  },
  methods:{
    async openNewPostModal () {
      const popover = await modalController
        .create({
          component: NewPostModal,
           cssClass:'modalCss',
           componentProps: {
            teams: this.canPostInTeams,
            canChangeVisiblity: true,
            title: this.$t("newPost.createPost"),
          },
        });
      popover.present();
      const result = await popover.onDidDismiss();
      if (result.data && result.data.action == "submit") {
        await this.store.dispatch("draft/submit");
      }
    },
  },
  components: {
    IonContent,
    IonPage,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonIcon,
    TeamFilterHeader,
    NewPost,
    Activity,
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
