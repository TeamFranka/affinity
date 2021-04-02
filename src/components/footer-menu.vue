<template>
  <div class="footer-box" scrollY="false" ref="drawerRef">
    <hr @click="toggleDrawer" v-if="false" />
    <ion-grid>
      <ion-row class="ion-text-center" style="font-size: 1rem">
        <ion-col>
          <router-link style="position: relative" to="/news">
            <ion-icon size="large" :icon="homeIcon" />
            <notification-dot color="danger" slot="end" />
          </router-link>
        </ion-col>
        <ion-col>
          <router-link style="position: relative" to="/faq">
            <ion-icon size="large" :icon="faqIcon" />
          </router-link>
        </ion-col>
        <ion-col>
          <router-link style="position: relative" to="/feed">
            <ion-icon size="large" :icon="feedIcon" />
          </router-link>
        </ion-col>
        <template v-if="isLoggedIn">
          <ion-col>
            <router-link style="position: relative" to="/inbox">
              <notification-dot v-if="false" color="warning" slot="start" />
              <ion-icon size="large" :icon="chatIcon" />
              <notification-dot v-if="false" color="danger" slot="end" />
            </router-link>
          </ion-col>
          <ion-col>
            <div @click="openUserPopover" style="position: relative">
              <avatar size="2em" :profile="user" />
            </div>
          </ion-col>
        </template>
        <template v-else>
          <ion-col>
            <router-link style="position: relative" to="/donate">
              <ion-icon size="large" :icon="donationsIcon" />
            </router-link>
          </ion-col>
          <ion-col>
            <ion-button data-cy="anon-menu-trigger" v-if="hasPush" color="medium" fill="clear" @click="openMenuPopover" class="footerIconAlign">
              <ion-icon size="large" :icon="settingsIcon" />
            </ion-button>
            <router-link v-else style="position: relative" to="/login">
              <ion-icon size="large" :icon="loginIcon" />
            </router-link>
          </ion-col>
        </template>
      </ion-row>
      <ion-row v-if="false">
        <ion-col size="6">
          <ion-button
            fill="outline"
            shape="round"
            expand="block"
            size="default"
            color="primary"
          >
            <ion-icon size="large" :icon="postIcon" />
            {{ $t("footer.extra.post") }}
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button
            fill="outline"
            shape="round"
            expand="block"
            size="default"
            color="secondary"
          >
            <ion-icon :icon="newChatIcon" /> {{ $t("footer.extra.chat") }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script lang="ts">
import {
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  popoverController,
} from "@ionic/vue";
import { createGesture } from "@ionic/core";
import {
  planetOutline,
  addCircleOutline,
  chatbubbleEllipsesOutline,
  fileTrayFullOutline,
  personCircleOutline,
  settings as settingsIcon,
  logInOutline as loginIcon,
  compassOutline as faqIcon,
  peopleCircleOutline,
  walletOutline,
} from "ionicons/icons";
import NotificationDot from "@/components/notification-dot.vue";
import Avatar from "@/components/avatar.vue";
import MyMenu from "@/components/my-menu.vue";
import AnonMenu from "@/components/anon-menu.vue";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";

const SMALL_HEIGHT = 60;

export default defineComponent({
  name: "FooterMenu",
  setup() {
    const store = useStore();
    return {
      isLoggedIn: computed(() => !!store.getters["auth/isLoggedIn"]),
      hasPush: computed(() => !!store.getters["auth/currentInstallation"]),
      user: computed(() => store.state.auth.user),
      homeIcon: planetOutline,
      feedIcon: peopleCircleOutline,
      donationsIcon: walletOutline,
      faqIcon,
      loginIcon,
      postIcon: addCircleOutline,
      chatIcon: fileTrayFullOutline,
      newChatIcon: chatbubbleEllipsesOutline,
      meIcon: personCircleOutline,
      settingsIcon,
    };
  },
  components: {
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    NotificationDot,
    Avatar,
  },
  methods: {
    async openUserPopover(ev: Event) {
      const popover = await popoverController.create({
        component: MyMenu,
        event: ev,
        translucent: true,
      });
      return popover.present();
    },
    async openMenuPopover(ev: Event) {
      const popover = await popoverController.create({
        component: AnonMenu,
        event: ev,
        translucent: true,
      });
      return popover.present();
    },
    toggleDrawer() {
      const c: any = this.$refs.drawerRef;
      if (c.dataset.open == "true") {
        c.dataset.open == "false";
        c.style.height = `${SMALL_HEIGHT}px`;
      } else {
        c.dataset.open == "true";
        c.style.height = `${c.scrollHeight}px`;
      }
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
      onMove: (event) => {
        const scHeight = c.scrollHeight;
        const curHeight = c.clientHeight;
        const newHeight = curHeight - event.deltaY;
        // console.log(scHeight, curHeight, newHeight, c, event.deltaY);
        if (scHeight + event.deltaY < 0) return;

        if (newHeight <= SMALL_HEIGHT) {
          c.style.height = `${SMALL_HEIGHT}px`;
        } else if (newHeight > scHeight / 2) {
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
        if (curHeight > scHeight / 2) {
          c.style.height = `${scHeight}px`;
          c.dataset.open = "true";
        } else {
          c.style.height = `${SMALL_HEIGHT}px`;
          c.dataset.open = "false";
        }
      },
    });

    // enable the gesture for the item
    gesture.enable(true);
  },
});
</script>

<style scoped>
a ion-icon {
  color: var(--ion-color-medium);
}
.router-link-active ion-icon {
  color: var(--ion-color-primary);
}
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
.footerIconAlign {
  margin: 0;
  height: auto;
}
</style>
