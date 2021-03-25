<template>
  <span :style="styles"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotificationDot",
  props: {
    slot: String,
    color: String,
  },
  computed: {
    styles() {
      const styles: any = { background: `var(--ion-color-${this.color})` };
      if (this.slot == "start") {
        styles.left = 0;
      } else if (this.slot == "end") {
        styles.right = 0;
      }
      return styles;
    },
  },
});
</script>
<style scoped>
span {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 100%;
}
</style>
