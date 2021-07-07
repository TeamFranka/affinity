<template>
  <ion-page>
    <team-filter-header  @team-selected="selectTeam($event)"/>

    <ion-content>
      <div class="wrap">
        <ion-spinner v-if="loading" name="dots"></ion-spinner>
        <ion-grid v-else>
          <ion-row>
            <ion-col
              size="4"
              size-lg="2"
              size-md="3"
              v-for="(picture, index) in pictures"
              :key="index"
            >
              <div class="square"></div>
              <div :key="index" class="gallery-img-wrap">
                <img
                  data-cy="image"
                  class="gallery-img"
                  :src="picture.file?.url"
                  @click="viewPicture(picture, index)"
                />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <ion-infinite-scroll @ionInfinite="loadMore($event)">
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
  IonContent, IonPage,modalController,
  IonCol,IonRow,IonGrid,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import PictureView from '../components/picture-view.vue';
import TeamFilterHeader from '../components/team-filter-header.vue';

export default defineComponent({
  name: 'Gallery',
   setup() {
    const store = useStore();
    return {
      loading: computed(() => store.getters["gallery/loading"]),
      pictures: computed(() => store.getters["gallery/entries"]),
      store,
      loadMore: (ev: CustomEvent) => {
        store.dispatch("gallery/loadMore").then(() => {
          (ev.target as any).complete();
        });
      },
      refresh() {
        store.dispatch("gallery/refresh");
      },
      selectTeam: async (name: string) => {
        await store.dispatch("gallery/selectTeam", name === "ALL" ? null : name);
      },
    }
  },
  mounted(){
    this.refresh()
  },
  methods:{
    async viewPicture (item: any,index: number) {
      const popover = await modalController
        .create({
          component: PictureView,
           cssClass:'modalCss',
           componentProps: {
            imgDetails: this.pictures,
            selectedIndex: index,
          },
        });
      await popover.present();
      const res = await popover.onDidDismiss();
            if (res) {
               console.log("",res)
            }
    },
  },

  components: {
    IonContent, IonPage,TeamFilterHeader,
    IonCol,IonRow,IonGrid,
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
  .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  .gallery-img-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 5px;
  }
  .square {
    margin-top: 100%;
  }
</style>