<template>
  <ion-card>
    <ion-card-header>
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
        <ion-chip v-if="isMember" @click="leave">
          <ion-icon :icon="checkmarkOutline"></ion-icon>
          <ion-label>{{ $t("myTeams.button.leave") }}</ion-label>
        </ion-chip>
        <ion-chip v-if="!isMember" color="light" class="join" @click="join">
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
import TeamsStore from "@/stores/TeamsStore";
import MyTeamSubteam from "./my-team-subteam.vue";

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
    const { state, dispatch } = useStore();
    const { teamId } = toRefs(props);

    const team = computed(() => TeamsStore.team(teamId.value));
    const subteams = computed(() => TeamsStore.subTeams(teamId.value));
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

ion-card-title a {
  text-decoration: none;
  color: var(--ion-text-color);
}

ion-card-header ion-chip {
  margin: 0;
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