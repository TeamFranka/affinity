<template>
  <ion-app>
    <ion-progress-bar v-if="loading" color="secondary" type="indeterminate"></ion-progress-bar>
    <ion-fab v-if="!user" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openLoginModal">
          <ion-icon name="log-in"/>
      </ion-fab-button>
    </ion-fab>
    <!-- FIXME: animation is broken -->
    <ion-content>
      <ion-router-outlet />
    </ion-content>
    <ion-footer>
      <footer-menu />
    </ion-footer>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonFooter, IonContent, IonProgressBar, IonFab, IonIcon,
  IonFabButton, modalController
} from '@ionic/vue';
import { defineComponent, computed } from 'vue'

// import SideMenu from '../components/side-menu.vue';
import FooterMenu from '../components/footer-menu.vue';
import Login from '../components/login.vue';
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
    IonContent,
    FooterMenu,
    // Login,
  },
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.state.auth.user),
      loginModalOpened: computed(() => {
        console.log("called");
        return store.state.auth.wantsToLogin
      }),
      loading: computed(() => store.state.global.loading),
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