<template>
  <ion-app>
    <ion-progress-bar v-if="loading" color="secondary" type="indeterminate"></ion-progress-bar>
    <ion-fab v-if="!user" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openLoginModal">
          <ion-icon :ion="logInIcon"/>
      </ion-fab-button>
    </ion-fab>
    <ion-header class="ion-hide-lg-down">
      <ion-toolbar>
        <ion-title slot="start"><router-link :to="titleLink">{{title}}</router-link></ion-title>
        <div slot="end">
          <router-link to="/faq">faq</router-link>
          <avatar size="45px" v-if="user" :profile="user" />
        </div>
      </ion-toolbar>
    </ion-header>
    <!-- FIXME: animation is broken -->
    <ion-content>
      <ion-router-outlet />
    </ion-content>
    <ion-footer >
      <footer-menu class="ion-hide-lg-up" />
    </ion-footer>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonFooter, IonProgressBar, IonFab, IonIcon,
  IonFabButton, modalController, isPlatform, IonToolbar, IonHeader, IonTitle,
} from '@ionic/vue';
import { logInOutline as logInIcon } from 'ionicons/icons';
import { defineComponent, computed } from 'vue'

// import SideMenu from '../components/side-menu.vue';
import FooterMenu from '../components/footer-menu.vue';
import Login from '../components/login.vue';
import Avatar from '../components/avatar.vue';
import { useStore } from '../stores/';


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonProgressBar,
    IonFooter,
    IonFab,
    IonFabButton,
    IonIcon,
    FooterMenu,
    IonToolbar,
    IonHeader,
    IonTitle,
    Avatar,
    // Login,
  },
  setup() {
    const store = useStore();
    store.dispatch("fetchDefaultTeam", (window as any).AFFINITY_DEFAULT_TEAM);
    return {
      logInIcon,
      onDesktop: isPlatform("desktop"),
      titleLink: computed(() => "/t/" + store.state.global.defaultTeam?.get("slug")),
      title: computed(() => store.state.global.defaultTeam?.get("name") || "affinity"),
      user: computed(() => store.state.auth.user),
      loginModalOpened: computed(() => {
        console.log("called");
        return store.state.auth.wantsToLogin
      }),
      loading: store.getters.isLoading,
      closeLoginModal: () => store.dispatch("auth/dismissLogin"),
      // openLoginModal: () => store.dispatch("auth/openLogin"),
      fetchUser: () => store.dispatch("auth/fetchUser")
     }
  },
  methods: {
    async openLoginModal() {
      const modal = await modalController
        .create({
          component: Login,
          componentProps: {
            title: 'New Title'
          },
        })
      return modal.present();
    },
  },
  mounted() {
    this.fetchUser();
    console.log("mounted");
  }
});
</script>
<style>
ion-app {
  align-items: center;
}
.wrap {
  max-width: 860px;
}
ion-content {
  display: flex;
  align-items: center;
}
</style>