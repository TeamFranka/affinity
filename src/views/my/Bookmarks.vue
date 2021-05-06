<template>
  <ion-page>
    <ion-content data-cy="bookmarks">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button />
          </ion-buttons>
          <ion-label><i18n-t keypath="menu.bookmarks"/></ion-label>
        </ion-toolbar>
      </ion-header>
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
      <ion-infinite-scroll v-if="canLoadMore" @ionInfinite="loadMore($event)" threshold="5%">
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonBackButton,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonButtons,
} from '@ionic/vue';
// import {
//   } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '@/stores/';
import Activity from "@/components/activity.vue";

export default defineComponent({
  name: 'Bookmarks',
  setup() {
    const store = useStore();
    const objMap = store.getters["objectsMap"];
    return {
      loading: computed(() => store.getters["auth/bookmarks/loading"]),
      canLoadMore: computed(() => store.getters["auth/bookmarks/canLoadMore"]),
      latestPosts: computed(() => store.getters["auth/bookmarks/entries"].map((x: any) => objMap[x.on.objectId])),
      showTeams: computed(() => store.getters["auth/myTeams"].length > 1),
      loadMore: (ev: CustomEvent) => {
        store.dispatch("auth/bookmarks/loadMore").then(() => {
          (ev.target as any).complete();
        });
      },
      store,
    }
  },
  mounted() {
    this.store.dispatch("auth/bookmarks/refresh");
  },
  methods:{
  },
  components: {
    IonContent,
    IonPage,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonBackButton,
    IonToolbar,
    IonHeader,
    IonLabel,
    IonButtons,
    Activity,
  }
});
</script>
