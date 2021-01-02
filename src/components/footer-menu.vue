<template>
  <div class="footer-box" scrollY="false" ref="drawerRef">
    <hr @click="toggleDrawer" v-if="isLoggedIn" />
    <ion-grid>
      <ion-row class="ion-text-center" style="font-size: 1rem;">
        <ion-col>
          <router-link style="position: relative" to="/news">
            <ion-icon size="large" :color="currentTab == 'news' ? 'primary' : 'medium'" :icon="homeIcon" />
            <notification-dot color="danger" slot="end" />
          </router-link>
        </ion-col>
        <ion-col>
        <router-link style="position: relative" to="/faq">
          <ion-icon size="large" :color="currentTab == 'faq' ? 'primary' : 'medium'" :icon="faqIcon" />
        </router-link>
        </ion-col>
        <ion-col>
        <router-link style="position: relative" to="/feed">
          <ion-icon size="large" :color="currentTab == 'feed' ? 'primary' : 'medium'" :icon="feedIcon" />
        </router-link>
        </ion-col>
        <ion-col  v-if="isLoggedIn">
        <router-link style="position: relative" to="/inbox">
          <notification-dot color="warning" slot="start" />
          <ion-icon size="large" :color="currentTab == 'inbox' ? 'primary' : 'medium'" :icon="chatIcon" />
          <notification-dot color="danger" slot="end" />
        </router-link>
        </ion-col>
        <ion-col  v-if="!isLoggedIn">
        <router-link style="position: relative" to="/donate">
          <ion-icon size="large" :color="currentTab == 'donate' ? 'primary' : 'medium'" :icon="donationsIcon" />
        </router-link>
        </ion-col>
        <ion-col v-show="isLoggedIn" >
        <router-link style="position: relative" to="/me">
          <ion-icon size="large" :color="currentTab == 'me' ? 'primary' : 'medium'" :icon="meIcon" />
        </router-link>
        </ion-col>
      </ion-row>
      <ion-row v-if="isLoggedIn" >
        <ion-col size="6">
          <ion-button fill="outline" shape="round" expand="block" size="default" color="primary">
            <ion-icon size="large" :icon="postIcon" /> New Post
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button fill="outline" shape="round" expand="block" size="default" color="secondary">
            <ion-icon :icon="newChatIcon" /> New Chat
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>


<script lang="ts">
import {
  IonIcon, IonButton, IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { createGesture } from "@ionic/core";
import {
  planetOutline, addCircleOutline, chatbubbleEllipsesOutline,
  fileTrayFullOutline, personCircleOutline,
  compassOutline as faqIcon, peopleCircleOutline, walletOutline
} from 'ionicons/icons';
import NotificationDot from './notification-dot.vue';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';

const SMALL_HEIGHT = 60;

export default defineComponent({
  name: 'FooterMenu',
  setup() {
    const store = useStore();
    return {
      isLoggedIn: computed(() => !!store.state.auth.user),
      homeIcon: planetOutline,
      feedIcon: peopleCircleOutline,
      donationsIcon: walletOutline,
      faqIcon,
      postIcon: addCircleOutline,
      chatIcon: fileTrayFullOutline,
      newChatIcon: chatbubbleEllipsesOutline,
      meIcon: personCircleOutline,
    }
  },
  components: {
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    NotificationDot
  },
  methods: {
    toggleDrawer() {
    const c: any = this.$refs.drawerRef;
      if (c.dataset.open == "true") {
        c.dataset.open == "false";
        c.style.height = `${SMALL_HEIGHT}px`;
      } else {
        c.dataset.open == "true";
        c.style.height = `${c.scrollHeight}px`;
      }
    }
  },
  computed: {
    currentTab(): string {
      const r: any = this.$route;
      console.log("currentroute", r);
      if (r.matched.length > 1) {
        return 'feed'
      }
      return r.path.slice(1)
    },
  },
  mounted() {
    const c: any = this.$refs.drawerRef;
    const gesture = createGesture({
      el: c,
      gestureName: "swipe-menu-up",
      direction: "y",
      /**
       * when moving, we start to show more of the drawer
       */
      onMove: event => {
        const scHeight = c.scrollHeight;
        const curHeight = c.clientHeight;
        const newHeight = curHeight - event.deltaY;
        // console.log(scHeight, curHeight, newHeight, c, event.deltaY);
        if (scHeight + event.deltaY < 0) return;

        if (newHeight <= SMALL_HEIGHT) {
          c.style.height = `${SMALL_HEIGHT}px`;
        } else if (newHeight > (scHeight / 2)) {
          c.style.height = `${scHeight}px`;
        } else {
          c.style.height = `${newHeight}px`;
        }
      },
      /**
       * when the moving is done, based on a specific delta in the movement; in this
       * case that value is -150, we determing the user wants to open the drawer.
       *
       * if not we just reset the drawer state to closed
       */
      onEnd: () => {
        const curHeight = c.clientHeight;
        const scHeight = c.scrollHeight;
        if (curHeight > (scHeight / 2)) {
          c.style.height = `${scHeight}px`;
          c.dataset.open = "true";
        } else {
          c.style.height = `${SMALL_HEIGHT}px`;
          c.dataset.open = "false";
        }
      }
    });

    // enable the gesture for the item
    gesture.enable(true);
  }
});
</script>

<style scoped>
hr {
  width: 10%;
  height: 0;
  border-top: 2px solid var(--ion-color-medium-tint);
  margin: 3px auto 0;
}
.footer-box {
  height: 60px;
  transition: 0.5s ease;
  --ionicon-stroke-width: 24px;
}
</style>