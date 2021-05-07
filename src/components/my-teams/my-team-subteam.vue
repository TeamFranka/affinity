<template>
  <ion-chip outline :color="isMember ? 'primary' : ''" @click="click" :class="isMember ? 'leave' : 'join'">
    <ion-icon :icon="isMember ? closeCircle : addCircle"></ion-icon>
    <ion-label>{{ team.name }}</ion-label>
  </ion-chip>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from "vue";
import { IonChip, IonLabel, IonIcon } from "@ionic/vue";
import { addCircle, closeCircle } from "ionicons/icons";
import { useStore } from "@/stores/";
import TeamsStore from "@/stores/TeamsStore";

export default defineComponent({
  name: "my-team-subteam",
  props: {
    teamId: {
      type: String,
      required: true,
    },
  },
  components: {
    IonChip,
    IonLabel,
    IonIcon,
  },
  setup(props) {
    const { state, dispatch } = useStore();
    const { teamId } = toRefs(props);

    const team = computed(() => TeamsStore.team(teamId.value));
    const isMember = computed(
      () => state.auth.teamPermissions[teamId.value]?.isMember
    );

    async function click() {
      if (isMember.value) await dispatch("auth/leaveTeam", teamId.value);
      else await dispatch("auth/joinTeam", teamId.value);
    }

    return { click, team, isMember, addCircle, closeCircle };
  },
});
</script>

<style scoped>
ion-chip.leave {
  color: var(--ion-color-primary);
}

ion-chip.leave ion-icon {
  color: var(--ion-color-primary);
  margin-right: 5px;
}

ion-chip ion-icon {
  color: var(--color);
  margin-right: 5px;
}

ion-chip ion-label {
  padding-top: 3px;
}
</style>
