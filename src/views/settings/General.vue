<template>
  <ion-page>
    <ion-content>
      <ion-list>
        <ion-list-header>
          {{ $t("menu.settings.general") }}
        </ion-list-header>
        <ion-item>
          <ion-label>
            {{ $t("setting.general.language") }}
          </ion-label>
          <ion-select
            :value="lang"
            @ion-change="langChange($event.target.value)"
            interface="popover"
          >
            <ion-select-option
              v-for="opt in SUPPORTED_LANGUAGES"
              :value="opt[0]"
              :key="opt[0]"
              >{{ opt[1] }}</ion-select-option
            >
          </ion-select>
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
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  globeOutline as generalIcon,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";

const SUPPORTED_LANGUAGES = [
  ["de", "Deutsch"],
  ["en", "English"],
];

export default defineComponent({
  name: "SettingsGeneral",
  setup() {
    const store = useStore();

    return {
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      lang: computed(() => store.state.auth.user?.lang),
      hasPush: computed(() => store.getters["auth/hasPush"]),
      langChange: (lang: string) => store.dispatch("auth/setLang", lang),
      SUPPORTED_LANGUAGES,
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
    IonLabel,
    IonSelect,
    IonSelectOption,
  },
});
</script>
