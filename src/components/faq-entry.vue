<template>
  <ion-card>
    <ion-card-header>
      <ion-card-subtitle>{{topic}}</ion-card-subtitle>
      <ion-card-title>{{title}}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>


<script lang="ts">
import {
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FaqEntry',
  props: {
      topic: String,
      title: String,
    },
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  }
});
</script>