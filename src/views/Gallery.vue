<template>
  <ion-page>
    <team-filter-header/>
    <ion-searchbar
        show-cancel-button="focus"
        :placeholder="$t('search')"
        inputmode="search"
        enterkeyhint="search"
        :value="searchValue"
        :v-model="searchValue"
    />
    <ion-content scroll-x="false" scroll-y="false">
      <ion-spinner v-if="loading" />
        <ion-grid>
            <ion-row>
                <ion-col size="3" v-for="(item, index) in filterPicture" :key="index"> 
                    <img :src="item.file?.url" @click="viewPicture(item,index)"/> 
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
  IonContent, IonPage,modalController
} from '@ionic/vue';
import {
  chatbubbles, heartOutline, mailOutline, addOutline, caretForwardOutline, search
} from 'ionicons/icons';
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
          pictureArray
      }
  },
   setup() {
    const store = useStore();
    const pictureArr: any[]=[];
    const elem = store.getters["news/latest"];
    return {
      store,
      pictureArr,
      elem
    }
  },

  //  computed: {
  //     newPictureList() {
        // console.log("list is=============",this.searchValue,this.searchValue.length)
        // if(this.selectedTeam == 0){
        //     return this.pictureList
        // }
        // else{
        //     return this.pictureList.filter((data: any)=>data.team == this.selectedTeam)
        // }
        //  if (this.searchValue.length) {
        //     const v = this.searchValue;
        //     const foundIcons = [];
        //     this.pictureList.forEach((g) => {
        //         if(g.name.match(v)){
        //             foundIcons.push(g)
        //         }            
        //     })
        //     return foundIcons
        // }
        // return this.pictureList
      // }
      
  // },
  computed:{
      filterPicture(){     
      const pictureList: any[] =[];
      this.elem.find((x: any)=>{
         const item = this.store.getters.objectsMap[x];
         item.objects.find((x: Model) =>{ if(x.className == "Picture"){pictureList.push(item.objects)}});
         });
         console.log("pictureArray==",pictureList)
      return pictureList;
    },
  },
  methods:{
  
    async viewPicture (item: any,selectedImg: any) {
      const popover = await modalController
        .create({
          component: PictureView,
           cssClass:'modalCss',
           componentProps: {
            imgDetails : item,
            zIndex:selectedImg
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
    IonContent, IonPage,TeamFilterHeader
    // PictureViewModal
    // IonToggle, IonSpinner, IonCard, IonCardContent,
    // NewPost, Activity
  },
});
</script>
<style scoped>
.flip-in {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
img{
  width: 50px;
  height: 50px;
}
</style>