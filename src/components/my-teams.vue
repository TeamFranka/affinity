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
    <my-team-card
      v-for="teamId in store.state.teams.teamIds"
      :key="teamId"
      :teamId="teamId"
    />
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonHeader, IonContent, IonToolbar, IonSearchbar } from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle } from "ionicons/icons";
import { useStore } from "@/stores/";
import MyTeamCard from "./my-team-card.vue";

export default defineComponent({
  name: "my-teams",
  components: { IonHeader, IonContent, IonToolbar, IonSearchbar, MyTeamCard },
  setup() {
    const store = useStore();
    return { store, checkmarkOutline, addCircle, closeCircle };
  },
  data: () => ({
    loading: true,
  }),
  computed: {},
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        await this.store.dispatch("teams/fetchTeams");
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
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