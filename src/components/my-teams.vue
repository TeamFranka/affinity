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
    <ion-card>
      <ion-card-header>
        <ion-avatar>
          <img src="https://placeimg.com/200/200/people" />
        </ion-avatar>
        <div>
          <ion-card-title>Team Franka</ion-card-title>
          <ion-chip>
            <ion-icon :icon="checkmarkOutline"></ion-icon>
            <ion-label>Member</ion-label>
          </ion-chip>
        </div>
      </ion-card-header>

      <ion-card-content>
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
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { checkmarkOutline, addCircle, closeCircle } from "ionicons/icons";

export default defineComponent({
  name: "my-teams",
  components: { IonIcon },
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

ion-card-header {
  background: #118;
  display: flex;
  flex-direction: row;
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