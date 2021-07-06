<template>
  <ion-page>
    <team-filter-header  @team-selected="searchValue = $event"/>
    <ion-searchbar
        show-cancel-button="focus"
        :placeholder="$t('gallery.search')"
        inputmode="search"
        enterkeyhint="search"
        :value="searchValue"
        @ion-change="searchValue = $event.target.value"
    />
    <ion-content>
      <div class="wrap">
        <ion-spinner v-if="loading" name="dots"></ion-spinner>
        <ion-grid v-else>
          <ion-row>
            <ion-col
              size="4"
              size-lg="2"
              size-md="3"
              v-for="(picture, index) in filteredPictures"
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
  IonContent, IonPage,modalController,IonSearchbar,
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
  data(){
      return{
          searchValue:'',
      }
  },
   setup() {
    const store = useStore();
    return {
      loading: computed(() => store.getters["feed/loading"]),
      latestPosts: computed(() => store.getters["feed/entries"]),
      store,
      loadMore: (ev: CustomEvent) => {
        store.dispatch("feed/loadMore").then(() => {
          (ev.target as any).complete();
        });
      },
    }
  },
  computed:{
    filteredPosts(): any[] {
      const postsWithPictures = this.latestPosts.filter((post: any) =>
        post.objects.some((object: any) => object.className === "Picture")
      );

        if (this.searchValue.length!==0 && this.searchValue!=='All' && this.searchValue!=='setting') {
          return postsWithPictures.filter((post: any) =>
            post.team.name.toLowerCase().includes(this.searchValue.toLowerCase())
          );
        }
        else{
            return postsWithPictures
        }
    },
    filteredPictures(): any[] {
      return this.filteredPosts.flatMap((post: any) => post.objects)
    },
  },
  methods:{
    async viewPicture (item: any,index: number) {
      const popover = await modalController
        .create({
          component: PictureView,
           cssClass:'modalCss',
           componentProps: {
            imgDetails: this.filteredPictures,
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
    IonContent, IonPage,TeamFilterHeader,IonSearchbar,
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