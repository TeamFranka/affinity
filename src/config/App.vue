<template>
  <ion-app>
    <ion-progress-bar v-if="loading" color="secondary" type="indeterminate"></ion-progress-bar>
    <ion-fab v-if="!user" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openLoginModal">
          <ion-icon :icon="logInIcon"/>
      </ion-fab-button>
    </ion-fab>
    <ion-header class="ion-hide-lg-down">
      <ion-toolbar>
        <ion-title slot="start">
          <router-link :to="titleLink">{{title}}</router-link>
        </ion-title>
        <div class="menu" slot="end">
          <router-link to="/faq">faq</router-link>

          <router-link style="position: relative" to="/inbox">
            <notification-dot color="warning" slot="start" />
            <ion-icon size="large" color="secondary" :icon="chatIcon" />
            <notification-dot color="danger" slot="end" />
          </router-link>
          <span v-if="user" @dblclick="logout">
            <avatar  size="45px" v-if="user" :profile="user" />
          </span>
          <ion-button fill="clear" v-else @click="openLoginModal">
              <ion-icon :icon="logInIcon"/> Einloggen
          </ion-button>
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
  IonApp, IonRouterOutlet, IonFooter, IonProgressBar, IonFab, IonIcon, IonContent,
  IonFabButton, modalController, isPlatform, IonToolbar, IonHeader, IonTitle,
  IonButton, toastController,
} from '@ionic/vue';
import {
  logInOutline as logInIcon,
  chatboxOutline as chatIcon,
} from 'ionicons/icons';
import NotificationDot from '../components/notification-dot.vue';
import { defineComponent, computed, watch } from 'vue'

// import SideMenu from '../components/side-menu.vue';
import FooterMenu from '../components/footer-menu.vue';
import LoginModal from '../components/login-modal.vue';
import Avatar from '../components/avatar.vue';
import { useStore } from '../stores/';


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
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
    IonButton,
    Avatar,
    NotificationDot,
    // Login,
  },
  setup() {
    const store = useStore();
    let loginModal: any = null;
    store.dispatch("fetchDefaultTeam", (window as any).AFFINITY_DEFAULT_TEAM);

    const updateLoginModal = async (newVal: boolean, oldVal: boolean) => {
      if (newVal && newVal != oldVal) {
        loginModal = await modalController
          .create({
            component: LoginModal,
            componentProps: {
              title: 'New Title'
            },
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
        console.log(newVal);
        const toast = await toastController
          .create({
            message: `Willkommen zurück, ${newVal.get('username')} 👋!`,
            color: "success",
            duration: 3000
          })
        return toast.present();

      } else if (!newVal) {
        const toast = await toastController
          .create({
            message: `Erfolgreich ausgeloggt`,
            duration: 2000
          })
        return toast.present();
      }
    })

    return {
      logInIcon, chatIcon,
      onDesktop: isPlatform("desktop"),
      titleLink: computed(() => "/t/" + store.state.global.defaultTeam?.get("slug")),
      title: computed(() => store.state.global.defaultTeam?.get("name") || "affinity"),
      user: computed(() => store.state.auth.user),
      loginModalOpened: computed(() => {
        return store.state.auth.wantsToLogin
      }),
      logout: () => store.dispatch('auth/logout'),
      openLoginModal: () => store.dispatch('auth/openLogin'),
      loading: store.getters.isLoading,
      // openLoginModal: () => store.dispatch("auth/openLogin"),
      fetchUser: () => store.dispatch("auth/fetchUser")
     }
  },
  mounted() {
    this.fetchUser();
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