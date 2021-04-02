<template>
    <div ref="qrcode" class="qrDiv"></div>
</template>
<script>
import { defineComponent } from "vue";
import * as QRCode from "easyqrcodejs";

export default defineComponent({
  name: "Qrcode",
  props: {
    text: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
  },
  mounted() {
    const options = {
      text: this.text,
      logo: this.logo,
      tooltip: true
    };

    // Create new QRCode Object
    new QRCode(this.$refs.qrcode, options);
  },
});
</script>

<style scoped>
.qrDiv {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
