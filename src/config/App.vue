<template>
  <ion-app data-cy="customStyles" :style="teamStyles">
    <ion-progress-bar v-if="loading" color="secondary" type="indeterminate"></ion-progress-bar>
    <header-bar />
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
  IonApp, IonRouterOutlet, IonFooter, IonProgressBar, IonContent,
  modalController, isPlatform, toastController,
} from '@ionic/vue';
import {
  logInOutline as logInIcon,
} from 'ionicons/icons';
import { defineComponent, computed, watch } from 'vue'

import FooterMenu from '@/components/footer-menu.vue';
import LoginModal from '@/components/login-modal.vue';
import HeaderBar from '@/components/header-bar.vue';
import { setupNotificationActions } from '@/utils/setup';
import { PushNotification, PushNotificationActionPerformed } from '@capacitor/push-notifications';
import { useStore } from '../stores/';

import { codePush } from 'capacitor-codepush';
import { App, AppState } from '@capacitor/app';

App.addListener('appStateChange', (state: AppState) => {
  // state.isActive contains the active state
  if (state.isActive) {
      codePush.sync();
  }
});

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonRouterOutlet,
    IonProgressBar,
    IonFooter,
    FooterMenu,
    HeaderBar,
  },
  setup() {
    const store = useStore();
    store.dispatch("init");
    let loginModal: any = null;
    store.dispatch("fetchDefaultTeam", (window as any).AFFINITY_DEFAULT_TEAM);

    const updateLoginModal = async (newVal: boolean, oldVal: boolean) => {
      if (newVal && newVal != oldVal) {
        loginModal = await modalController
          .create({
            component: LoginModal,
          })
        loginModal.present();
        loginModal.onDidDismiss().then(()=>{
          store.dispatch("auth/dismissLogin");
        })
      } else if (!newVal && loginModal) {
        loginModal.dismiss();
        loginModal = null;
      }
    };

    watch(() => store.state.auth.wantsToLogin, updateLoginModal);
    if (store.state.auth.wantsToLogin) { updateLoginModal(true, false) }

    watch(() => store.state.auth.user, async (newVal, oldVal) => {
      if (newVal && newVal != oldVal) {
        const toast = await toastController
          .create({
            message: `Willkommen zurück, ${newVal.username} 👋!`,
            color: "success",
            duration: 3000
          })
        return toast.present();

      } else if (!newVal) {
        location.reload();
        const toast = await toastController
          .create({
            message: `Erfolgreich ausgeloggt`,
            duration: 2000
          })
        return toast.present();
      }
    })

    return {
      logInIcon,
      onDesktop: isPlatform("desktop"),
      user: computed(() => store.state.auth.user),
      loginModalOpened: computed(() => {
        return store.state.auth.wantsToLogin
      }),
      teamStyles: computed(() => store.getters.defaultTeam?.customStyles),
      openLoginModal: () => store.dispatch('auth/openLogin'),
      loading: store.getters.isLoading,
      // openLoginModal: () => store.dispatch("auth/openLogin"),
      fetchUser: () => store.dispatch("auth/fetchUser")
     }
  },
  mounted() {
    this.fetchUser();

    setupNotificationActions((x: PushNotification) => {
      console.log("received", x);
    }, (n: PushNotificationActionPerformed) => {
      console.log("action", n);
      let data = n.notification.data.data;
      if (typeof data === 'string' || data instanceof String) {
        try {
          data = JSON.parse(data as string);
        } catch (e) {
          console.error("received incorrect data in notification action", data, e)
          return
        }
      }
      if (data.urlTarget) {
        this.$router.push(data.urlTarget);
      }
    });
  }
});
</script>
<style>
ion-app {
  align-items: center;
}
.menu {
  display: flex;
  align-items: center;
}
.menu > * {
  margin-right: 0.3em;
}
.wrap {
  max-width: 860px;
}
ion-content {
  display: flex;
  align-items: center;
}
</style>