<template>
<ion-list>
    <ion-item dataCyRole="login" button @click="login">
        <ion-label><ion-icon :icon="logInIcon"/> Anmelden</ion-label>
    </ion-item>
    <ion-item button @click="select({name: 'SettingsNotifications'})">
        <ion-label><ion-icon :icon="notificationIcon"/> Push-Einstellungen</ion-label>
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
            store.dispatch("auth/login");
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