<template>
  <div class="footer-box" scrollY="false" ref="drawerRef">
    <hr @click="toggleDrawer" />
    <ion-tab-bar>
      <ion-tab-button tab="news" href="/news">
          <ion-icon :icon="homeIcon" />
          <ion-badge color="danger"></ion-badge>
      </ion-tab-button>
      <ion-tab-button tab="faq" href="/faq">
          <ion-icon :icon="faqIcon" />
      </ion-tab-button>
      <ion-tab-button tab="feed" href="/feed">
          <ion-icon :icon="feedIcon" />
      </ion-tab-button>
      <ion-tab-button v-if="isLoggedIn" tab="inbox" href="/inbox">
          <ion-icon :icon="chatIcon" />
          <ion-badge color="danger">3</ion-badge>
      </ion-tab-button>
      <ion-tab-button v-if="!isLoggedIn" tab="donations" href="/donate">
          <ion-icon :icon="donationsIcon" />
      </ion-tab-button>
      <ion-tab-button v-show="isLoggedIn" tab="me" href="/me">
          <ion-icon :icon="meIcon" />
      </ion-tab-button>
    </ion-tab-bar>
    <ion-grid>
      <ion-row>
        <ion-col size="6">
            <ion-button fill="outline" shape="round" expand="block" size="default" color="primary">
              <ion-icon :icon="postIcon" /> New Post
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
  IonIcon, IonTabBar, IonTabButton, IonButton, IonGrid, IonRow, IonCol, IonBadge
} from '@ionic/vue';
import { createGesture } from "@ionic/core";
import {
  planetOutline, addCircleOutline, chatbubbleEllipsesOutline,
  fileTrayFullOutline, personCircleOutline,
  listOutline, peopleCircleOutline, walletOutline
} from 'ionicons/icons';
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
      faqIcon: listOutline,
      postIcon: addCircleOutline,
      chatIcon: fileTrayFullOutline,
      newChatIcon: chatbubbleEllipsesOutline,
      meIcon: personCircleOutline,
    }
  },
  components: {
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
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
}
ion-tab-bar {
  border-top: unset;
}
</style>