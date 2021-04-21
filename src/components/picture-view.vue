<template>
  <!-- <ion-page> -->
   
    <ion-content scroll-x="false" scroll-y="false">
         <ion-header>
        <ion-toolbar>
            <ion-button class="closeIcon" color="dark" fill="clear" slot="start">
              <ion-back-button @click="closeModal"/>
              <ion-label>{{$t('pictureView.back')}}</ion-label>
            </ion-button>
        </ion-toolbar>
    </ion-header>

    <div class="flip-in" ref="box" v-if="imgDetails && imgDetails.length > 0">
      <picture-view-modal
        v-for="(item, index) in imgDetails"
        :itemId="item"
        :key="item"
        :z-index="index"
        :indexValue="currentIndex"
        :itemData="imgDetails"
      />
    </div>
  </ion-content>
</template>

<script lang="ts">
import { modalController,
IonBackButton,
IonLabel,
IonToolbar,
IonHeader,
IonButton,
IonContent } from '@ionic/vue';
import { closeOutline as closeIcon } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { createGesture } from "@ionic/core";
import { useStore } from 'vuex';
import PictureViewModal from '../components/picture-view-modal.vue';

export default defineComponent({
  name: 'PictureView',
  emits: ['next'],
  props: {
    imgDetails:{
        type: Array,
        required: true
    },
    zIndex:{
      type: Number,
    }
  },
  components: {
    PictureViewModal,
    IonBackButton,
    IonLabel,
    IonToolbar,
    IonHeader,
    IonButton,
    IonContent
  },

  setup(props: any) {
    const store = useStore();
    return {
      closeIcon,
      store,
      currentIndex: props.zIndex
    };
  },
  
  methods:{
      closeModal() {
        modalController.dismiss()
      },
  },

  mounted() {
    if (this.imgDetails.length !== 0) {
    
 
    const c: any  = this.$refs.box;
    let prev: any, next: any;

    console.log(c);

    const gesture = createGesture({
      el: c,
      gestureName: "pull-back",
      threshold: 0,
      onStart: () => {
        const hidden = c.getElementsByClassName("hidden");
        const shown = c.getElementsByClassName("shown");
        console.log("picking", hidden, shown);
        if (hidden.length == 0) {
          prev = null;
        } else {
          prev = hidden[0];
        }

        if (shown.length > 1) {
          next = shown[shown.length -1];
        } else {
          next = null;
        }
        console.log("starting", prev, next);
      },
      onMove: ev => {
        console.log(prev);
        if (prev && ev.deltaY > 0) {
          prev.style.transform = `translateY(${ev.deltaY}px)`;
        }
        if (next && ev.deltaY < 0) {
          next.style.transform = `translateY(${ev.deltaY}px)`;
        }
      },
      onEnd: ev => {
        if (prev) {
          prev.style.transform = '';
          if (ev.deltaY > 150) {
            prev.classList.remove("hidden");
            prev.classList.add("shown");
          } else {
            prev.classList.add("hidden");
            prev.classList.remove("shown");
          }
        }
        if (next) {
          next.style.transform = '';
          if (ev.deltaY < -150) {
            next.classList.add("hidden");
            next.classList.remove("shown");
          } else {
            next.classList.remove("hidden");
            next.classList.add("shown");
          }
        }
      },
    });

    gesture.enable();
    }
  },

});
</script>
<style scoped>
.flip-in {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.slidebox {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  right: 0;
  transition: 0.25s ease-out;
  overflow: hidden;
  display: flex;
  align-content: center;
  justify-content: center;
}
.slidebox.hidden {
  transform: translateY(-100%);
}
.slidebox > img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
.slidebox > .text {
  position: absolute;
  bottom: 1em;
  color: white;
  left: 1em;
  right: calc(0.5em + 65px);
}
ion-back-button{
    display: block;
}
</style>