<template>
  <router-link :to="routeTo">{{ text }}</router-link>
</template>
<script lang="ts">
// import {
//   IonCard, IonImg, IonCardHeader, IonIcon, IonNote,
// } from '@ionic/vue';
// import { chatbubblesOutline, addOutline, arrowRedoOutline, heartOutline } from 'ionicons/icons';

//  import { useStore } from '../stores/';
import { defineComponent } from "vue";

export default defineComponent({
  name: "ObjectLink",
  props: {
    object: {
      type: Object,
      required: true,
    },
    mine: Boolean,
  },
  computed: {
    type(): string {
      return this.object.className;
    },
    text(): string {
      if (this.type == "Activity") {
        if (this.object.text) {
          return `${this.mine ? "Dein " : ""} Post`;
        }
      }

      return "was auch immer";
    },
    routeTo(): any {
      if (this.type == "Activity") {
        return {
          name: "ViewActivity",
          params: { activityId: this.object.objectId },
        };
      }
      return {};
    },
  },
});
</script>
