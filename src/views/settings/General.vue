<template>
  <ion-page>
    <ion-content>
        <ion-list>
          <ion-list-header>
            {{ $t('menu.settings.general') }}
          </ion-list-header>
          <ion-item>
            <ion-label>
            {{ $t('setting.general.language') }}
            </ion-label>
            <ion-select :value="lang" @ion-change="langChange($event.target.value)" interface="popover">
              <ion-select-option
                v-for="opt in SUPPORTED_LANGUAGES"
                :value="opt[0]"
                :key="opt[0]">{{opt[1]}}</ion-select-option>
            </ion-select>
          </ion-item>

           <ion-item>
            <ion-label>
            {{ $t('setting.general.theme') }}
            </ion-label>
            <ion-select :value="themes" @ion-change="themeChange($event.target.value)" interface="popover" v-if="lang == 'en'">
              <ion-select-option
                v-for="opt in SUPPORTED_THEMES"
                :value="opt[0]"
                :key="opt[0]">{{opt[1]}}</ion-select-option>
            </ion-select>
            
             <ion-select :value="themes" @ion-change="themeChange($event.target.value)" interface="popover" v-else="lang == 'de'">
              <ion-select-option
                v-for="opt in SUPPORTED_THEMES_DEUTSCH"
                :value="opt[0]"
                :key="opt[0]">{{opt[1]}}</ion-select-option>
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

const SUPPORTED_THEMES = [
  ["dark", "Dark Theme"],
  ["light", "Light Theme"],
];

const SUPPORTED_THEMES_DEUTSCH = [
  ["dark", "Donker thema"],
  ["light", "Licht thema"],
];

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
      themes: computed(() => store.state.auth.user?.settings?.themes),
      hasPush: computed(() => store.getters['auth/hasPush']),
      langChange:  (lang: string) => store.dispatch("auth/setLang", lang),
      themeChange: (themes: string) => { store.dispatch("auth/setSetting", {themes}); if(themes == 'light') {document.body.classList.remove('dark'); } else { document.body.classList.add('dark') } } ,
      SUPPORTED_LANGUAGES, SUPPORTED_THEMES, SUPPORTED_THEMES_DEUTSCH, generalIcon, notificationIcon,
    }
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
