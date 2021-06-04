<template>
  <ion-card>
    <ion-card-header :style="headerStyles">
      <router-link :to="linkUrl">
        <avatar :profile="team" />
      </router-link>
      <div class="header-content">
        <ion-card-title>
          <router-link :to="linkUrl">
            {{ team?.name }}
          </router-link>
        </ion-card-title>
        <ion-chip :data-cy-team="team.slug" color="primary" v-if="isMember" class="leave" @click="leave">
          <ion-icon :icon="checkmarkOutline"></ion-icon>
          <ion-label>{{ $t("myTeams.button.leave") }}</ion-label>
        </ion-chip>
        <ion-chip :data-cy-team="team.slug" color="light" v-if="!isMember" class="join" @click="join">
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
import { defineComponent } from "vue";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle, add } from "ionicons/icons";
import { useStore } from "@/stores/";
import { Team } from "@/types/team";
import MyTeamSubteam from "./my-team-subteam.vue";
import Avatar from "@/components/avatar.vue";

const DEFAULT_STYLES: Partial<CSSStyleDeclaration> = {
  background: "transparent",
  backgroundImage:
    "linear-gradient(to right, var(--ion-color-secondary) 0%, var(--ion-color-primary) 100%)",
};

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
    Avatar,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonIcon,
    MyTeamSubteam,
  },
  computed: {
    team(): Team {
      return this.store.getters.objectsMap[this.teamId]
    },
    subteams(): Team[] {
      return this.store.getters["teams/subteams"][this.teamId]
    },
    linkUrl(): string {
      return `/t/${this.team.slug}`
    },
    headerStyles(): any {
    const customStyles = this.team.customStyles;
    const extraStyles: Partial<CSSStyleDeclaration> = {};
    const backgroundImage = this.team.background;
    if (backgroundImage) {
      extraStyles.backgroundImage = `url(${ backgroundImage.url })`;
      extraStyles.backgroundSize = "cover";
    }
    return [DEFAULT_STYLES, customStyles, extraStyles];
    },
    isMember(): boolean {
      return this.store.state.auth.teamPermissions[this.teamId]?.isMember
    }
  },
  methods: {
    async join() {
      await this.store.dispatch("auth/joinTeam", this.teamId);
    },
    async leave() {
      await this.store.dispatch("auth/leaveTeam", this.teamId);
    }
  },
  setup() {
    const store = useStore();
    return {
      store,
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

ion-card-content {
  padding: 13px;
}

ion-chip ion-label {
  padding-top: 3px;
}

</style>