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
                <ion-col size="3" v-for="(item, index) in filterPicture" :key="index"> 
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
import { Model } from '@/utils/model';
// import PictureViewModal from '../components/picture-view-modal.vue';
import TeamFilterHeader from '../components/team-filter-header.vue';

export default defineComponent({
  name: 'Gallery',
  data(){
      const pictureArray: any[] = [];     
      return{
          searchValue:'',
          selectedTeam:0,
          pictureArray,
          teamValue:''
      }
  },
   setup() {
    const store = useStore();
    const pictureArr: any[]=[];
    // const elem = store.getters["news/latest"];
    return {
      elem: computed(() => store.getters["news/latest"]),
      store,
      pictureArr
    }
  },
  computed:{
      filterPicture(){     
        const pictureList: any[] =[];
        this.elem.find((x: any)=>{
        const item = this.store.getters.objectsMap[x];
         item.objects.find((x: Model) =>{ if(x.className == "Picture"){
           pictureList.push(item.objects[0])
          }});
         });
      
        if (this.searchValue.length!==0 && this.searchValue!=='All' && this.searchValue!=='setting') {
            const v = this.searchValue;
            const foundIcons: any[] = [];
            
            pictureList.forEach((g: any) => {
                if(g.team.name.toLowerCase().indexOf(v.toLowerCase()) > -1){
                  foundIcons.push(g)
                }           
            })
            return foundIcons
        }
        else{
            return pictureList;
        }
    },
  },

  created(){
    this.filterGallery()
  },
  methods:{
   filterGallery(){
      //  const pictureList: any[] =[];
      this.elem.find((x: any)=>{
         const item = this.store.getters.objectsMap[x];
         item.objects.find((x: Model) =>{ if(x.className == "Picture"){
           this.pictureArray.push(item.objects[0])
          }});
         });
   },
    async viewPicture (item: any,selectedImg: any) {
      const pictureList: any[] =[];
      this.elem.find((n: any)=>{
         const item = this.store.getters.objectsMap[n];
         item.objects.find((x: Model) =>{ if(x.className == "Picture"){pictureList.push(n)}});
      });
      
      const popover = await modalController
        .create({
          component: PictureView,
           cssClass:'modalCss',
           componentProps: {
            imgDetails : pictureList,
            zIndex: selectedImg
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