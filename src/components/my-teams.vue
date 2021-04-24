<template>
  <ion-header>
    <div class="title ion-padding-horizontal">
      <h2>My Teams</h2>
      <div>4 selected</div>
    </div>
    <ion-toolbar>
      <ion-searchbar placeholder="Search"></ion-searchbar>
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
import { useStore } from "@/stores/";
import MyTeamCard from "./my-team-card.vue";

export default defineComponent({
  name: "my-teams",
  components: { IonHeader, IonContent, IonToolbar, IonSearchbar, MyTeamCard },
  setup() {
    const store = useStore();
    const loading = ref(true);
    const teamIds = computed(() => store.state.teams.teamIds);

    onMounted(async () => {
      try {
        loading.value = true;
        await store.dispatch("teams/fetchTeams");
        loading.value = false;
      } catch (error) {
        console.log(error);
      }
    });

    return { loading, teamIds, checkmarkOutline, addCircle, closeCircle };
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