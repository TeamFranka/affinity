<template>
  <ion-header>
    <div class="title ion-padding-horizontal">
      <h2>{{ $t("myTeams.title") }}</h2>
      <div>{{ $t("myTeams.selectedNumber", { count }) }}</div>
    </div>
    <ion-toolbar>
      <ion-searchbar
        v-model="query"
        :placeholder="$t('myTeams.placeholder.search')"
      ></ion-searchbar>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <my-team-card v-for="teamId in teamIds" :key="teamId" :teamId="teamId" />
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { IonHeader, IonContent, IonToolbar, IonSearchbar } from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle } from "ionicons/icons";
import MyTeamCard from "../my-teams/my-team-card.vue";
import TeamsStore from "@/stores/TeamsStore";
import { useStore } from "@/stores";

export default defineComponent({
  name: "my-teams",
  components: { IonHeader, IonContent, IonToolbar, IonSearchbar, MyTeamCard },
  setup() {
    const { state } = useStore();
    const loading = ref(true);
    const teams = computed(() => TeamsStore.rootTeams);
    const query = ref("");
    const teamIds = computed(() =>
      teams.value
        .filter(
          ({ name }) =>
            !query.value ||
            name?.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())
        )
        .map(({ objectId }) => objectId)
    );
    const count = computed(
      () =>
        teamIds.value.filter(
          (teamId) => state.auth.teamPermissions[teamId]?.isMember
        )?.length
    );

    onMounted(async () => {
      try {
        loading.value = true;
        TeamsStore.fetchTeams();
        loading.value = false;
      } catch (error) {
        console.log(error);
      }
    });

    return {
      count,
      teamIds,
      query,
      loading,
      checkmarkOutline,
      addCircle,
      closeCircle,
    };
  },
});
</script>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
}

ion-toolbar {
  --background: transparent;
}
</style>