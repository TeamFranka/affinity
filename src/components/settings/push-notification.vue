<template>
  <h3>{{title}}</h3>
  <ion-list>
    <ion-item-group v-for="t in teams" :key="t.id">
      <ion-item-divider>
        <ion-label><avatar with-name :profile="t" /></ion-label>
          <ion-toggle
            slot="end"
            :checked="teamSelected(t)"
          />
      </ion-item-divider>
      <ion-item v-for="entry in fields" :key="entry.key">
        <ion-toggle
          slot="start"
          :checked="isChecked(t, entry.key)"
        />
        <ion-label>{{entry.title}}</ion-label>
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>
<script lang="ts">
import {
  IonList, IonItem, IonItemGroup, IonToggle, IonItemDivider, IonLabel,
} from '@ionic/vue';
import { notificationsOutline as notificationIcon , logoWhatsapp, cloudUploadOutline } from 'ionicons/icons';
import Avatar from '@/components/avatar.vue';
import { useStore } from '@/stores/';
import { defineComponent, computed } from 'vue';

const TEAM_FIELDS = [
  {key: 'news', title: 'Team Neuigkeiten'},
  {key: 'notifications', title: 'Pings an mich'},
  {key: 'posts', title: 'Community Beiträge'},
  {key: 'activities', title: 'Community Aktivitäten'},
]

export default defineComponent({
  name: 'PushNotificationSetting',
  props: {
    title: {
      type: String,
      required: true,
    },
    installation: {
      type: Object,
      required: true
    }
  },
  setup() {
    const store = useStore();

    return {
      teams: computed(() => store.getters["auth/teamPointers"].map((x: any) => store.getters['objectsMap'][x.objectId])),
      fields: TEAM_FIELDS,
      notificationIcon, logoWhatsapp, uploadIcon: cloudUploadOutline
    }
  },
  methods: {
    isChecked(team: any, field: string) {
      const installation = this.installation;
      console.log("checking for", installation, team, field);
      if (!installation.channels || installation.channels.length == 0) {
        return false
      }
      return installation.channels.indexOf(`${team.objectId}:${field}`) !== -1
    },
    teamSelected(team: any) {
      return this.installation.channels && this.installation.channels.find((x: string) => x.startsWith(team.objectId))
    }
  },
  components: {
    IonList, IonItem, IonItemGroup, IonToggle, IonItemDivider, IonLabel,
    Avatar,
  }

})
</script>