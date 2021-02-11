<template>
  <ion-page>
    <ion-content>
        <h2><ion-icon :icon="notificationIcon" /> Einstellungen</h2>
        <template v-if="currentDevice">
          <h3>Dieses Gerät ({{currentDevice.name}})</h3>
        </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,  IonIcon,} from '@ionic/vue';
import { notificationsOutline as notificationIcon , logoWhatsapp, cloudUploadOutline } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '@/stores/';
import Parse from 'parse';

export default defineComponent({
  name: 'NotificationSettings',
  setup() {
    const store = useStore();

    return {
      currentDevice: computed(() => store.state.auth.installation ),
      teams: computed(() => store.getters["auth/teams"]),
      notificationIcon, logoWhatsapp, uploadIcon: cloudUploadOutline
    }
  },
  methods: {
  },
  components: {
    IonPage,
    IonContent,
    IonIcon,
  }
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0
}
.profile-img {
  width: 50%;
}
</style>