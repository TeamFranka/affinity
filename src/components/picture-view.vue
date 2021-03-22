<template>
  <!-- <ion-page> -->
   
    <ion-content scroll-x="false" scroll-y="false">
         <ion-header>
        <ion-toolbar>
            <ion-button class="closeIcon" color="dark" fill="clear" @click="closeModal" slot="start">
              <ion-back-button/>
              <ion-label>back</ion-label>
            </ion-button>
        </ion-toolbar>
    </ion-header>
     
      <div class="flip-in" ref="box">
          <div  v-for="(item,index) in imgDetails" :key="index">
                <div class="slidebox shown" :key="index" :style="extraStyle" @dblclick="like" ref="slideBox">
                <ion-img :src="item.file?.url"/>
                </div>
          </div>
          <!-- <picture-view-modal
          v-for="(id, index) in imgDetails"
          :z-index="index"
          :key="id"
        /> -->
      </div>
    </ion-content>
    
</template>

<script lang="ts">
import { IonLabel, IonIcon, IonImg, IonCard,modalController } from '@ionic/vue';
import { createAnimation } from '@ionic/core';
import { chatbubblesOutline as commentsIcon, heart as likeIcon, closeOutline as closeIcon } from 'ionicons/icons';
import Avatar from './avatar.vue';
import Poll from './poll.vue';
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import { since } from '../utils/time';
import Parse from "parse";
import { defineComponent, computed } from 'vue';
import { createGesture } from "@ionic/core";
import { useStore } from 'vuex';
// import PictureViewModal from '../components/picture-view-modal.vue';

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
    // PictureViewModal
  },
  data() {
       console.log("img details------------",this.imgDetails)
       return{
           
       }
  },

  setup() {
    const store = useStore();
    return {
      closeModal() {
        modalController.dismiss()
      },
      likeIcon,closeIcon
    }
  },
  computed:{
       extraStyle(): object {
      // const style = (this.imgDetails.extra || {})['style'] || {
      //   'background': "var(--ion-color-tertiary )"
      // };
      const style = {
        'background': "var(--ion-color-tertiary )"
      };
      const localStyle = {
        'z-index': this.zIndex,
      };
      return Object.assign({}, style, localStyle);
    }
  },
    mounted() {
    if (this.imgDetails.length === 0) {
      // this.refresh();
    }

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