<template>
  <ion-button
    :data-cy="dataCy"
    @click="toggleOpen(!showPopover, $event)"
    :disabled="disabled"
    fill="clear"
    :color="color"
  >
    <slot name="label">
      <ion-label v-if="label" color="dark" style="padding-right: 0.5em">{{
        label
      }}</ion-label>
    </slot>
    <slot name="current">
      <ion-label>{{ title }}</ion-label>
    </slot>
    <ion-icon :icon="showIcon" />
  </ion-button>
  <ion-popover :is-open="showPopover" :event="event">
    <div class="ion-padding">
      <ion-title v-if="popoverTitle">{{ popoverTitle }}</ion-title>
      <slot
        name="item"
        v-for="item in items"
        :key="item"
        :item="item"
        :select="selectItem"
      ></slot>
    </div>
  </ion-popover>
</template>
<script>
import { IonIcon, IonButton, IonPopover, IonTitle, IonLabel } from "@ionic/vue";
import { chevronDown as showIcon } from "ionicons/icons";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Selector",
  emits: ["select"],
  props: {
    popoverTitle: String,
    title: String,
    label: String,
    dataCy: String,
    items: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: "medium",
    },
    disabled: Boolean,
  },
  setup() {
    const showPopover = ref(false);
    const event = ref();
    const toggleOpen = (state, evt) => {
      event.value = evt;
      showPopover.value = state;
    };
    return { showIcon, showPopover, event, toggleOpen };
  },
  components: {
    IonPopover,
    IonIcon,
    IonButton,
    IonTitle,
    IonLabel,
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
      this.showPopover = false;
    },
  },
});
</script>
<style scoped></style>
