<template>
  <ion-app>
    <ion-progress-bar color="secondary" type="indeterminate"></ion-progress-bar>
    <ion-content>
      <user-icon v-if="user" :user="user"></user-icon>
      <ion-router-outlet />
    </ion-content>
    <ion-footer>
      <footer-menu />
    </ion-footer>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonFooter, IonContent, IonProgressBar
} from '@ionic/vue';
import { defineComponent, computed } from 'vue'

// import SideMenu from '../components/side-menu.vue';
import FooterMenu from '../components/footer-menu.vue';
import UserIcon from '../components/user-icon.vue';
import { useStore } from '../store';


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonProgressBar,
    IonFooter,
    UserIcon,
    IonContent,
    FooterMenu,
  },
  setup() {
    const store = useStore();
    return {
      user: computed(() => store.state.user),
      fetchUser: () => store.dispatch("fetchUser")
     }
  },
  mounted() {
    this.fetchUser();
    console.log("mounted");
  }
});
</script>