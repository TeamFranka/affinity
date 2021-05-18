<template>
  <ion-page>
    <team-filter-header @team-selected="selectTeam($event)" />
    <ion-content scroll-x="false" scroll-y="false" data-cy="activity-gallery">
      <ion-spinner v-if="loading" name="dots"></ion-spinner>
      <ion-grid v-else>
        <ion-row>
          <ion-col
            size="4" size-lg="2" size-md="3"
            v-for="(item, index) in entries"
            :key="index"
            class="custom-card"
          >
            <div :key="index" class="grid-div">
              <img
                data-cy="image"
                class="grid-img"
                :src="item.file?.url"
                @click="viewPicture(item, index)"
              />
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-infinite-scroll @ionInfinite="loadMore($event)" threshold="5%">
        <ion-infinite-scroll-content
          loading-spinner="crescent"
          :loading-text="$t('generic.state.loadingMore')"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-content> </ion-content>
  </ion-page>
</template>
<script lang="ts">
import {
  IonContent,
  IonPage,
  modalController,
  IonCol,
  IonRow,
  IonGrid,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";
import PictureView from "../components/picture-view.vue";
import TeamFilterHeader from "../components/team-filter-header.vue";
export default defineComponent({
  name: "Gallery",
  setup() {
    const store = useStore();

    return {
      loading: computed(() => store.getters["gallery/loading"]),
      refresh() {
        store.dispatch("gallery/refresh");
      },
      selectTeam: async (name: string) => {
        await store.dispatch("gallery/selectTeam", name === "ALL" ? null : name);
      },
      entries: computed(() => store.getters["gallery/entries"]),
      store,
    };
  },
  mounted() {
    console.log('entries response', this.entries);
    if (!this.loading && this.entries.length === 0) {
      this.refresh();
    }
  },
  methods: {
    async viewPicture(item: any, selectedImg: any) {
      if(this.loading) {
        return;
      }
        const popover = await modalController.create({
        component: PictureView,
        cssClass: "modalCss",
        componentProps: {
          imgDetails: this.entries,
          zIndex: (this.entries.length - (selectedImg + 1)),
        },
      });
      await popover.present();
      const res = await popover.onDidDismiss();
      if (res) {
        console.log("", res);
      }
    },
  },
  components: {
    IonContent,
    IonPage,
    TeamFilterHeader,
    IonCol,
    IonRow,
    IonGrid,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
});
</script>
<style scoped>
.flip-in {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.custom-card {
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  height: 130px;
  padding: 0;
  margin-bottom: 8px;
}
.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}
.grid-div {
  width: 100%;
  height: 100%;
  box-shadow: rgb(0 0 0 / 12%) 0px 4px 16px;
  border-radius: 5px;
  margin: 0px 5px;
}
</style>