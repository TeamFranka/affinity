<template>
<ion-list>
    <ion-item lines="full" button @click="select({ name: 'Me' })">
        <ion-label>My Profile</ion-label>
    </ion-item>
    <!-- <ion-item button @click="select({name: 'MySettings'})">
        <ion-label>Einstellungen</ion-label>
    </ion-item> -->
    <ion-item button @click="select({name: 'SettingsNotifications'})">
        <ion-label><ion-icon :icon="notificationIcon"/> Push Einstellungen</ion-label>
    </ion-item>
    <ion-item dataCyRole="logout" button @click="logout">
        <ion-label><ion-icon :icon="logOutIcon"/> Logout</ion-label>
    </ion-item>
</ion-list>
</template>
<script type="ts">
import {
    IonList, IonItem, IonLabel, IonIcon,
    popoverController,
} from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  logOutOutline as logOutIcon
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
        logOutIcon, notificationIcon
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