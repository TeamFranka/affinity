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
    <ion-content scroll-x="false" scroll-y="false">

        <ion-grid>
            <ion-row>
                <ion-col size="3" v-for="(item, index) in filteredPictures" :key="index">
                  <ion-thumbnail :key="index">
                    <img :src="item.file?.url" @click="viewPicture(item,index)"/>
                  </ion-thumbnail>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
    <ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent, IonPage,modalController,IonSearchbar,
  IonCol,IonRow,IonGrid,IonThumbnail
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
      latestPosts: computed(() => store.getters["feed/entries"]),
      store,
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
            imgDetails: this.filteredPosts,
            zIndex: index,
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
    IonCol,IonRow,IonGrid,IonThumbnail
  },
});
</script>
<style scoped>
.flip-in {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>