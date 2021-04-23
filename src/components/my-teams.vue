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
    <my-team-card />
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonHeader, IonContent, IonToolbar, IonSearchbar } from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle } from "ionicons/icons";
import MyTeamCard from "./my-team-card.vue";

export default defineComponent({
  name: "my-teams",
  components: { IonHeader, IonContent, IonToolbar, IonSearchbar, MyTeamCard },
  setup() {
    return { checkmarkOutline, addCircle, closeCircle };
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