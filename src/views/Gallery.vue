<template>
  <ion-page>
    <team-filter-header @team-selected="searchValue = $event" />
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
          <ion-col
            size="4" size-lg="2" size-md="3"
            v-for="(item, index) in filterPicture"
            :key="index"
            class="custom-card"
          >
            <div :key="index" class="grid-div">
              <img
                class="grid-img"
                :src="item.file?.url"
                @click="viewPicture(item, index)"
              />
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-content> </ion-content>
  </ion-page>
</template>
<script lang="ts">
import {
  IonContent,
  IonPage,
  modalController,
  IonSearchbar,
  IonCol,
  IonRow,
  IonGrid,
} from "@ionic/vue";
import { defineComponent, computed } from "vue";
import { useStore } from "../stores/";
import PictureView from "../components/picture-view.vue";
import TeamFilterHeader from "../components/team-filter-header.vue";
export default defineComponent({
  name: "Gallery",
  data() {
    const pictureArray: any[] = [];
    return {
      searchValue: "",
      selectedTeam: 0,
      pictureArray,
      teamValue: "",
    };
  },
  setup() {
    const store = useStore();
    const pictureArr: any[] = [];
    return {
      elem: computed(() => store.getters["feed/latestPosts"]),
      store,
      pictureArr,
    };
  },
  computed: {
    filterPicture() {
      const pictureList: any[] = [];
      this.elem.find((x: any) => {
        if (x.className == "Picture") {
          console.log("inside pic", x);
        } else {
          if (x.objects[0]) {
            pictureList.push(x.objects[0]);
          }
        }
      });
      if (this.searchValue.length!==0 && this.searchValue!=='All' && this.searchValue!=='setting') {
        const v = this.searchValue;
          const foundIcons: any[] = [];
          pictureList.forEach((g: any) => {
            if(g.team.name.toLowerCase().indexOf(v.toLowerCase()) > -1){
              foundIcons.push(g)
              }
          })
          console.log(foundIcons);
          return foundIcons
      }
      else{
        console.log("pictureList",pictureList);
          return pictureList;
      }
    },
  },
  created() {
    this.filterGallery();
  },
  methods: {
    filterGallery() {
      const pictureList: any[] = [];
      this.elem.find((x: any) => {
        if (x.objects[0]) {
          pictureList.push(x.objects[0]);
        }
      });
    },
    async viewPicture(item: any, selectedImg: any) {
      const tempData: any[] = [];
      this.elem.find((x: any) => {
        if (x.objects[0]) {
          tempData.push(x);
        }
      });
      
      const popover = await modalController.create({
        component: PictureView,
        cssClass: "modalCss",
        componentProps: {
          imgDetails: tempData.slice().reverse(),
          zIndex: selectedImg,
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
    IonSearchbar,
    IonCol,
    IonRow,
    IonGrid,
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