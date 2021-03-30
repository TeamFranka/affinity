<template>
  <ion-list>
    <ion-item button @click="select({ name: 'Me' })">
      <ion-label
        ><ion-icon :icon="profileIcon" />
        {{ $t("menu.my.MyProfile") }}</ion-label
      >
    </ion-item>
    <ion-item button @click="select({ name: 'Settings' })">
      <ion-label
        ><ion-icon :icon="settingsIcon" /> {{ $t("menu.settings") }}</ion-label
      >
    </ion-item>
    <ion-item dataCyRole="logout" button @click="logout" lines="none">
      <ion-label color="danger"
        ><ion-icon :icon="logOutIcon" /> {{ $t("menu.logout") }}</ion-label
      >
    </ion-item>
  </ion-list>
</template>
<script type="ts">
import {
    IonList, IonItem, IonLabel, IonIcon,
    popoverController,
} from "@ionic/vue";
import {
  buildOutline as settingsIcon,
  notificationsOutline as notificationIcon,
  logOutOutline as logOutIcon,
  personCircleOutline as profileIcon,
} from 'ionicons/icons';
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MyMenu',
  components: {
    IonList, IonItem, IonLabel, IonIcon,
  },
  setup() {
    const store = useStore();
    return {
        user: computed(() => store.state.auth.user),
        logout() {
            store.dispatch("auth/logout");
            popoverController.dismiss();
        },
        logOutIcon, notificationIcon, profileIcon, settingsIcon,
    }
  },
  methods: {
    select(to) {
        this.$router.push(to);
        popoverController.dismiss();
    }
  }
});
</script>
