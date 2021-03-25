<template>
  <ion-list data-cy="anon-menu">
    <ion-item dataCyRole="login" button @click="login">
      <ion-label
        ><ion-icon :icon="logInIcon" /> {{ $t("menu.auth.login") }}</ion-label
      >
    </ion-item>
    <ion-item
      button
      data-cy="push-settings-link"
      @click="select({ name: 'SettingsNotifications' })"
    >
      <ion-label
        ><ion-icon :icon="notificationIcon" />
        {{ $t("menu.settings.push") }}</ion-label
      >
    </ion-item>
  </ion-list>
</template>
<script type="ts">
import {
    IonList, IonItem, IonLabel,
    popoverController, IonIcon,
} from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  logInOutline as logInIcon
} from 'ionicons/icons';

import { useStore } from '@/stores/';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnonMenu',
  components: {
    IonList, IonItem, IonLabel, IonIcon,
  },
  setup() {
    const store = useStore();
    return {
        login() {
            store.dispatch("auth/openLogin");
            popoverController.dismiss();
        },
        notificationIcon, logInIcon
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
