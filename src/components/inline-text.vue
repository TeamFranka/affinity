<template>
  <form @submit.prevent="$emit('submit')" class="ion-padding">
    <ion-input
      @keyup="$emit('changed', $event.target.value)"
      :value="value"
      :placeholder="placeholder"
      enterkeyhint="enter"
    />
    <ion-button type="submit" size="small" fill="clear" :disabled="!canSubmit">
      <ion-icon :icon="submitIcon || defaultIcon" />
    </ion-button>
  </form>
</template>

<script lang="ts">
import { IonIcon, IonInput, IonButton } from "@ionic/vue";
import { paperPlaneOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "InlineText",
  emits: ["changed", "submit"],
  props: {
    value: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    canSubmit: {
      type: Boolean,
    },
    submitIcon: {},
  },
  setup() {
    return {
      defaultIcon: paperPlaneOutline,
    };
  },
  components: {
    IonIcon,
    IonInput,
    IonButton,
  },
});
</script>
<style scoped>
form {
  display: flex;
}
</style>
