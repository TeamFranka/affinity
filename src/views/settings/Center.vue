<template>
  <ion-page>
    <ion-content>
      <ion-list>
        <ion-list-header>
          {{ $t("settings.title") }}
        </ion-list-header>
        <template v-if="isLoggedIn">
          <ion-item button @click="$router.push({ name: 'SettingsGeneral' })">
            <ion-icon :icon="generalIcon" /> {{ $t("menu.settings.general") }}
          </ion-item>
        </template>
        <ion-item
          button
          v-if="hasPush"
          @click="$router.push({ name: 'SettingsNotifications' })"
        >
          <ion-icon :icon="notificationIcon" /> {{ $t("menu.settings.push") }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
} from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  globeOutline as generalIcon,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";

export default defineComponent({
  name: "Settings",
  setup() {
    const store = useStore();

    return {
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      hasPush: computed(() => store.getters["auth/hasPush"]),
      generalIcon,
      notificationIcon,
    };
  },
  components: {
    IonPage,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
  },
});
</script>
