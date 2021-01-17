<template>
  <ion-header class="ion-hide-lg-down">
    <ion-toolbar>
      <ion-title slot="start">
        <router-link to="/">{{title}}</router-link>
      </ion-title>
      <div class="menu" slot="end">
        <router-link to="/faq">faq</router-link>

        <template v-if="isLoggedIn" >
          <router-link style="position: relative" to="/inbox">
            <notification-dot color="warning" slot="start" />
            <ion-icon size="large" color="secondary" :icon="chatIcon" />
            <notification-dot color="danger" slot="end" />
          </router-link>
          <div @click="openUserPopover" style="position: relative">
            <avatar  size="45px" :profile="user" />
          </div>
        </template>

        <ion-button fill="clear" v-else @click="openLoginModal">
          <ion-icon :icon="logInIcon"/> Einloggen
        </ion-button>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {
  IonToolbar, IonHeader, IonIcon, IonButton, IonTitle, popoverController
} from '@ionic/vue';
import {
  logInOutline as logInIcon,
  chatboxOutline as chatIcon,
} from 'ionicons/icons';
import NotificationDot from '../components/notification-dot.vue';
import Avatar from '../components/avatar.vue';
import MyMenu from '../components/my-menu.vue';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';

export default defineComponent({
  name: 'HeaderBar',
  setup() {
    const store = useStore();
    return {
      logInIcon, chatIcon,
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      openLoginModal: () => store.dispatch('auth/openLogin'),
      user: computed(() => store.state.auth.user),
      title: computed(() => store.state.global.defaultTeam?.get("name") || "affinity"),
    }
  },
  methods: {
    async openUserPopover(ev: Event) {
      const popover = await popoverController
        .create({
          component: MyMenu,
          event: ev,
          translucent: true
        })
      return popover.present();
    },
  },
  components: {
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButton,
    IonIcon,
    Avatar,
    NotificationDot,
  },
});
</script>

<style scoped>
</style>