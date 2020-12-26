<template>
  <ion-page>
    <ion-content scroll-x="false" scroll-y="false">
      <ion-spinner v-if="loading" />
      <div class="flip-in" ref="box">
        <news-item :item="n" v-for="n in feed" :key="n.id" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent, IonSlide, IonPage, IonButton, IonIcon, IonSlides, IonSpinner,
  isPlatform
} from '@ionic/vue';
import {
  chatbubbles, logoWhatsapp, heartOutline, mailOutline, addOutline, caretForwardOutline
} from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import NewsItem from '../components/news-item.vue';
import { useStore } from '../stores/';
import { createGesture } from "@ionic/core";

export default defineComponent({
  name: 'NewsFeed',
  setup() {
    const store = useStore();
    return {
      loading: computed(() => store.getters["news/loading"]),
      refresh(){ store.dispatch("news/refresh"); },
      feed: computed(() => store.getters["news/latest"].map((id: string) => store.getters["objectsMap"][id])),
      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,
      teamSplitter: caretForwardOutline,
    }
  },
  mounted() {
    if (!this.loading && this.feed.length === 0) {
      this.refresh();
    }

    const c: any  = this.$refs.box;
    let prev: any, next: any;

    console.log(c);

    const gesture = createGesture({
      el: c,
      gestureName: "pull-back",
      threshold: 0,
      onStart: ev => {

        console.log("starting", c);
        const hidden = c.getElementsByClassName("hidden");
        const shown = c.getElementsByClassName("shown");
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

        console.log("Started for ", prev, next);
      },
      onMove: ev => {
        console.log(prev);
        if (prev && ev.deltaY > 0) {
          console.log("setting on prev", ev.deltaY);
          prev.style.transform = `translateY(${ev.deltaY}px)`;
        }
        if (next && ev.deltaY < 0) {
          console.log("setting on next", ev.deltaY);
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
        console.log("End");
      },
    });

    gesture.enable();
  },
  methods: {
    makeStyle(n: Parse.Object): any {
      const url = n.get('objects')[0].get('file').url();
      console.log(url);
      return {
        background: `url(${url}) no-repeat center center`,
        backgroundSize: 'cover'
      };
    }
  },
  components: {
    IonContent, IonPage, IonSpinner, NewsItem,
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
</style>