<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-content overflow-scroll="true">
        <iframe
          src="https://franka.jetzt/spenden-fwd"
          width="100%"
          height="100%"
          style="border: none; overflow: hidden"
        ></iframe>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from "@ionic/vue";

export default {
  name: "Donations",
  components: { IonContent, IonPage },
};
</script>
