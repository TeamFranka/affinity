<template>
  <ion-fab vertical="top" horizontal="end" slot="fixed">
    <ion-fab-button color="light">
      <ion-avatar>
        <img v-bind:src="user.avatar" />
      </ion-avatar>
    </ion-fab-button>
    <ion-fab-list>
      <ion-fab-button color="success">
        <ion-icon :icon="logIn"></ion-icon>
      </ion-fab-button>
      <ion-fab-button color="light">
        <ion-icon name="logo-twitter"></ion-icon>
      </ion-fab-button>
      <ion-fab-button color="danger">
        <ion-icon :icon="logOut"></ion-icon>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>

<script lang="ts">
import {
  IonAvatar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from "@ionic/vue";
import { logIn, logOut } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserIcon",
  props: {
    user: Object,
  },
  setup() {
    return {
      logOut,
      logIn,
    };
  },
  components: {
    IonAvatar,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
  },
});
</script>
