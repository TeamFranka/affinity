<template>
  <h3>{{title}}</h3>
  <ion-list>
    <ion-item-group v-for="t in teams" :key="t.id">
      <ion-item-divider>
        <ion-label><avatar with-name :profile="t" /></ion-label>
          <ion-button
            fill="clear"
            color="medium"
            slot="end"
            @click="disableTeam(t)"
            :disabled="!teamSelected"
          >
            <ion-icon :icon="clearIcon" />
          </ion-button>
      </ion-item-divider>
      <ion-item v-for="entry in fields" :key="entry.key">
        <ion-toggle
          slot="start"
          @ion-change="entryToggle($event.detail.checked, t, entry.key)"
          :checked="isChecked(t, entry.key)"
        />
        <ion-label>{{entry.title}}</ion-label>
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>
<script lang="ts">
import {
  IonList, IonItem, IonItemGroup, IonToggle, IonItemDivider, IonLabel, IonButton, IonIcon,
} from '@ionic/vue';
import {
  notificationsOutline as notificationIcon , logoWhatsapp, cloudUploadOutline,
  notificationsOffOutline as clearIcon,
  } from 'ionicons/icons';
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
  emits: ["channels-updated"],
  props: {
    title: {
      type: String,
      required: true,
    },
    channels: {
      type: Array,
      required: true
    }
  },
  setup() {
    const store = useStore();

    return {
      teams: computed(() => store.getters["auth/teamPointers"].map((x: any) => store.getters['objectsMap'][x.objectId])),
      fields: TEAM_FIELDS,
      notificationIcon, logoWhatsapp, uploadIcon: cloudUploadOutline, clearIcon
    }
  },
  methods: {
    isChecked(team: any, field: string) {
      return this.channels.indexOf(`${team.objectId}:${field}`) !== -1
    },
    teamSelected(team: any) {
      return (this.channels as Array<string>).find((x: string) => x.startsWith(`${team.objectId}:`))
    },
    disableTeam(team: any) {
      const newList = (this.channels as Array<string>).filter((x: string) => !x.startsWith(`${team.objectId}:`))
      this.$emit("channels-updated", newList);
    },
    entryToggle(checked: boolean, team: any, field: string) {
      const key = `${team.objectId}:${field}`;
      let newList;
      if (checked) {
        if (this.isChecked(team, field)) {
          return
        }
        newList = Array.from(this.channels);
        newList.push(key);
      } else {
        if (!this.isChecked(team, field)) {
          return
        }
        newList = (this.channels as Array<string>).filter((x: string) => x != key);
      }
      console.log("updating", newList);
      this.$emit("channels-updated", newList);
    }
  },
  components: {
    IonList, IonItem, IonItemGroup, IonToggle, IonItemDivider, IonLabel, IonButton, IonIcon,
    Avatar,
  }

})
</script>