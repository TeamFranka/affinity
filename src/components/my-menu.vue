<template>
<ion-list>
    <ion-item lines="full" button @click="select({name: 'Profile', params: {username: user.get('username')} })">
        <ion-label>My Profile</ion-label>
    </ion-item>
    <ion-item button @click="select({name: 'MySettings'})">
        <ion-label>Settings</ion-label>
    </ion-item>
    <ion-item button @click="logout">
        <ion-label>Logout</ion-label>
    </ion-item>
</ion-list>
</template>
<script type="ts">
import {
    IonList, IonItem, IonLabel,
    popoverController,
} from "@ionic/vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'MyMenu',
  components: {
    IonList, IonItem, IonLabel
  },
  setup() {
    const store = useStore();
    return {
        user: computed(() => store.state.auth.user),
        logout() {
            store.dispatch("auth/logout");
            popoverController.dismiss();
        }
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