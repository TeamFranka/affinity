<template>
  <h3>{{ title }}</h3>
  <ion-list>
    <ion-item-group v-for="t in teams" :key="t.id">
      <ion-item-divider>
        <ion-label><avatar with-name :profile="t" /></ion-label>
        <ion-button
          fill="clear"
          color="medium"
          slot="end"
          @click="disableTeam(t)"
          :disabled="!checked[t.id]"
        >
          <ion-icon :icon="clearIcon" />
        </ion-button>
      </ion-item-divider>
      <ion-item v-for="entry in fields" :key="entry" :data-cy-channel="entry">
        <ion-toggle
          slot="start"
          @ion-change="entryToggle($event.detail.checked, t, entry)"
          :checked="checked[`${t.objectId}:${entry}`]"
        />
        <ion-label>{{ $t(`setting.push.${entry}`) }}</ion-label>
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>
<script lang="ts">
import {
  IonList,
  IonItem,
  IonItemGroup,
  IonToggle,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  logoWhatsapp,
  cloudUploadOutline,
  notificationsOffOutline as clearIcon,
} from "ionicons/icons";
import Avatar from "@/components/avatar.vue";
import { useStore } from "@/stores/";
import { defineComponent, computed } from "vue";

const TEAM_FIELDS = ["news", "notifications", "posts", "activities"];

export default defineComponent({
  name: "PushNotificationSetting",
  emits: ["channels-updated"],
  props: {
    title: {
      type: String,
      required: true,
    },
    channels: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    return {
      teams: computed(() =>
        store.getters["auth/teamPointers"].map(
          (x: any) => store.getters["objectsMap"][x.objectId]
        )
      ),
      fields: TEAM_FIELDS,
      notificationIcon,
      logoWhatsapp,
      uploadIcon: cloudUploadOutline,
      clearIcon,
    };
  },
  computed: {
    checked(): Record<string, boolean> {
      const mapped: Record<string, boolean> = {};
      (this.channels as Array<string>).forEach((x: string) => {
        mapped[x] = true;
        mapped[x.split(":", 1)[0]] = true;
      });
      return mapped;
    },
  },
  methods: {
    disableTeam(team: any) {
      const newList = (this.channels as Array<string>).filter(
        (x: string) => !x.startsWith(`${team.objectId}:`)
      );
      this.$emit("channels-updated", newList);
    },
    entryToggle(checked: boolean, team: any, field: string) {
      const key = `${team.objectId}:${field}`;
      let newList;
      if (checked) {
        if (this.checked[key]) {
          return;
        }
        newList = Array.from(this.channels);
        newList.push(key);
      } else {
        if (!this.checked[key]) {
          return;
        }
        newList = (this.channels as Array<string>).filter(
          (x: string) => x != key
        );
      }
      this.$emit("channels-updated", newList);
    },
  },
  components: {
    IonList,
    IonItem,
    IonItemGroup,
    IonToggle,
    IonItemDivider,
    IonLabel,
    IonButton,
    IonIcon,
    Avatar,
  },
});
</script>
