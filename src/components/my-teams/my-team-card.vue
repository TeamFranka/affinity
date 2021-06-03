<template>
  <ion-card>
    <ion-card-header :style="headerStyles">
      <router-link :to="linkUrl">
        <ion-avatar>
          <img :src="avatarUrl" />
        </ion-avatar>
      </router-link>
      <div class="header-content">
        <ion-card-title>
          <router-link :to="linkUrl">
            {{ team?.name }}
          </router-link>
        </ion-card-title>
        <ion-chip color="primary" v-if="isMember" class="leave" @click="leave">
          <ion-icon :icon="checkmarkOutline"></ion-icon>
          <ion-label>{{ $t("myTeams.button.leave") }}</ion-label>
        </ion-chip>
        <ion-chip color="light" v-if="!isMember" class="join" @click="join">
          <ion-icon :icon="add"></ion-icon>
          <ion-label>{{ $t("myTeams.button.join") }}</ion-label>
        </ion-chip>
      </div>
    </ion-card-header>

    <ion-card-content class="ion-padding">
      <my-team-subteam
        v-for="subteam in subteams"
        :key="subteam.objectId"
        :teamId="subteam.objectId"
      />
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from "vue";
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
import MyTeamSubteam from "./my-team-subteam.vue";
import useHeaderStyles from "@/utils/hooks/useHeaderStyles";

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
    MyTeamSubteam,
  },
  setup(props) {
    const { state, dispatch, getters } = useStore();
    const { teamId } = toRefs(props);

    const team = computed(() => getters.objectsMap[teamId.value]);
    const headerStyles = useHeaderStyles(team);
    const subteams = computed(() => getters["teams/subTeams"][teamId.value]);
    const linkUrl = computed(() => `/t/${team.value?.slug}`);
    const avatarUrl = computed(() => team.value.avatar?.url() || null);
    const isMember = computed(
      () => state.auth.teamPermissions[teamId.value]?.isMember
    );

    async function join() {
      await dispatch("auth/joinTeam", teamId.value);
    }

    async function leave() {
      await dispatch("auth/leaveTeam", teamId.value);
    }

    return {
      headerStyles,
      leave,
      join,
      linkUrl,
      avatarUrl,
      team,
      subteams,
      isMember,
      add,
      checkmarkOutline,
      addCircle,
      closeCircle,
    };
  },
});
</script>

<style scoped>
ion-card {
  text-align: left;
}

ion-card-header {
  display: flex;
  flex-direction: row;
}

ion-card-title {
  margin-bottom: 8px;
}

ion-card-title a {
  text-decoration: none;
  color: inherit;
}

ion-card-header ion-chip {
  border-width: 1px;
  border-style: solid;
  margin: 0;
}

ion-card-header ion-chip.leave {
  border-color: var(--ion-color-contrast);
  color: var(--ion-color-contrast);
  background-color: var(--ion-color-primary);
}

ion-card-header ion-chip.join {
  border-color: var(--color);
  color: var(--color);
  background-color: var(--ion-color-base);
}


ion-avatar {
  display: inline;
  width: 30%;
  height: 30%;
  margin-right: 2em;
}

ion-avatar img {
  border: 3px solid #fff;
  background: #fff;
  width: 25vw;
  height: 25vw;
}

ion-card-content {
  padding: 13px;
}

ion-chip ion-label {
  padding-top: 3px;
}
</style>