<template>
  <ion-page>
    <ion-content scroll-x="false" scroll-y="false">
      <ion-spinner v-if="loading" />
      <div class="flip-in" ref="box">
        <news-item
          v-for="(o, index) in feed"
          :z-index="feed.length - index"
          :itemId="o.objectId"
          :key="o.objectId"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import {
  chatbubbles,
  heartOutline,
  mailOutline,
  addOutline,
  caretForwardOutline,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import NewsItem from "../components/news-item.vue";
import { useStore } from "../stores/";
import { createGesture } from "@ionic/core";

export default defineComponent({
  name: "NewsFeed",
  setup() {
    const store = useStore();
    return {
      loading: computed(() => store.getters["news/loading"] && !store.getters["news/entries"]),
      canLoadMore: computed(() => store.getters["news/canLoadMore"]),
      loadMore() {
        store.dispatch("news/loadMore");
      },
      refresh() {
        store.dispatch("news/refresh");
      },
      feed: computed(() => store.getters["news/entries"]),
      chatbubbles,
      like: heartOutline,
      mail: mailOutline,
      plus: addOutline,
      teamSplitter: caretForwardOutline,
    };
  },
  watch: {
    "feed": "refreshGesture"
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refreshGesture() {
      if (!this.loading && this.feed.length === 0) {
        return
      }

      const c: any = this.$refs.box;
      let prev: any, next: any;

      const gesture = createGesture({
        el: c,
        gestureName: "pull-back",
        threshold: 0,
        onStart: () => {
          const hidden = c.getElementsByClassName("hidden");
          const shown = c.getElementsByClassName("shown");
          // console.log("picking", hidden, shown);
          if (hidden.length == 0) {
            prev = null;
          } else {
            prev = hidden[0];
          }

          if (shown.length > 1) {
            next = shown[0];
          } else {
            next = null;
          }
          // console.log("starting", prev, next);
        },
        onMove: (ev) => {
          // console.log(prev);
          if (prev && ev.deltaY > 0) {
            prev.style.transform = `translateY(${ev.deltaY}px)`;
          }
          if (next && ev.deltaY < 0) {
            next.style.transform = `translateY(${ev.deltaY}px)`;
          }
        },
        onEnd: (ev) => {
          if (prev) {
            prev.style.transform = "";
            if (ev.deltaY > 150) {
              prev.classList.remove("hidden");
              prev.classList.add("shown");
            } else {
              prev.classList.add("hidden");
              prev.classList.remove("shown");
            }
          }
          if (next) {
            next.style.transform = "";
            if (ev.deltaY < -150) {
              next.classList.add("hidden");
              next.classList.remove("shown");
            } else {
              next.classList.remove("hidden");
              next.classList.add("shown");
            }
          };

          const shown = c.getElementsByClassName("shown");
          if (this.canLoadMore && shown.length < 5) {
            this.loadMore();
          }
        },
      });

      gesture.enable();
    }
  },
  components: {
    IonContent,
    IonPage,
    IonSpinner,
    NewsItem,
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
