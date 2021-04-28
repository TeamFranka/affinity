<template>
  <ion-card>
    <ion-card-header>
      <ion-avatar>
        <img :src="avatarUrl" />
      </ion-avatar>
      <div class="header-content">
        <ion-card-title>{{ team?.name }}</ion-card-title>
        <ion-chip v-if="isMember">
          <ion-icon :icon="checkmarkOutline"></ion-icon>
          <ion-label>Member</ion-label>
        </ion-chip>
        <ion-chip v-if="!isMember" color="light" class="join">
          <ion-icon :icon="add"></ion-icon>
          <ion-label>Join</ion-label>
        </ion-chip>
      </div>
    </ion-card-header>

    <ion-card-content class="ion-padding">
      <ion-chip>
        <ion-icon :icon="addCircle"></ion-icon>
        <ion-label>Olvenstedt</ion-label>
      </ion-chip>
      <ion-chip>
        <ion-icon :icon="closeCircle"></ion-icon>
        <ion-label>Newsroom</ion-label>
      </ion-chip>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, watchEffect } from "vue";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle, add } from "ionicons/icons";
import { useStore } from "@/stores/";
import TeamsStore from '@/stores/TeamsStore';

export default defineComponent({
  name: "my-team-card",
  props: {
    teamId: {
      type: String,
      required: true,
    },
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonAvatar,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonIcon,
  },
  setup(props) {
    const { state } = useStore();
    const { teamId } = toRefs(props);

    const team = computed(() => TeamsStore.team(teamId.value));

    const isMember = computed(
      () => state.auth.teamPermissions[teamId.value]?.isMember
    );

    const avatarUrl = computed(() => {
      return team.value.avatar?.url() || null;
    });

    watchEffect(() => {
      console.log(avatarUrl.value);
    });

    return { avatarUrl, team, isMember, add, checkmarkOutline, addCircle, closeCircle };
  },
});
</script>

<style scoped>
.join {
  background: #fff;
  color: #000;
}

.join ion-icon {
  color: #000;
}

ion-card {
  text-align: left;
}

ion-card-header {
  background: #118;
  display: flex;
  flex-direction: row;
}

ion-card-title {
  margin-bottom: 8px;
}

ion-card-header ion-chip {
  margin: 0;
}

ion-avatar {
  width: 30%;
  height: 30%;
  margin-right: 2em;
}

ion-avatar img {
  border: 3px solid #fff;
  background: #fff;
}

ion-card-content {
  padding: 13px;
}

ion-chip {
  color: #fff;
}

ion-chip ion-icon {
  color: #fff;
  margin-right: 5px;
}

ion-chip ion-label {
  padding-top: 3px;
}
</style>