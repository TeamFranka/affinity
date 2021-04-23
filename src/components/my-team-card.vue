<template>
  <ion-card>
    <ion-card-header>
      <ion-avatar>
        <img src="https://placeimg.com/200/200/people" />
      </ion-avatar>
      <div class="header-content">
        <ion-card-title>Team Franka</ion-card-title>
        <ion-chip>
          <ion-icon :icon="checkmarkOutline"></ion-icon>
          <ion-label>Member</ion-label>
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
import { defineComponent } from "vue";
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
import { checkmarkOutline, addCircle, closeCircle } from "ionicons/icons";

export default defineComponent({
  name: "my-team-card",
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
  setup() {
    return { checkmarkOutline, addCircle, closeCircle };
  },
});
</script>

<style scoped>
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