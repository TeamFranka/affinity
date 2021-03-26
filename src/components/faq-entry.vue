<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title @click="opened = !opened"
        ><ion-icon :icon="opened ? openedIcon : closedIcon" />
        {{ title }}</ion-card-title
      >
      <ion-card-subtitle>
        <ion-chip
          size="small"
          outline="true"
          color="secondary"
          v-for="tag in tags"
          :key="tag"
          @click="$emit('tag-selected', tag)"
          >{{ tag }}</ion-chip
        >
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content v-if="opened">
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonChip,
} from "@ionic/vue";
import {
  chevronDownOutline as openedIcon,
  chevronForwardOutline as closedIcon,
} from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "FaqEntry",
  emits: ["tag-selected"],
  props: {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
  },
  setup() {
    return {
      openedIcon,
      closedIcon,
    };
  },
  data() {
    return {
      opened: false,
    };
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonChip,
  },
});
</script>
