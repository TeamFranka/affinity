<template>
  <ion-button
    fill="clear"
    v-for="i in icons"
    :key="i.key"
    :color="selected == i.key ? 'primary' : 'medium'"
    :title="i.title"
    @click="select(i)"
  >
    <ion-icon :icon="i.icon" />
  </ion-button>
</template>
<script lang="ts">
import { IonIcon, IonButton, popoverController } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconSelector",
  components: {
    IonIcon,
    IonButton,
  },
  props: {
    icons: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: String,
    },
  },
  methods: {
    select(entry: any) {
      popoverController.dismiss(entry);
    },
  },
});
</script>
