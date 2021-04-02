<template>
  <span v-if="inline" v-html="compiled"></span>
  <div v-else v-html="compiled"></div>
</template>
<script>
import { adminMd, userMd } from "../utils/md";
import { defineComponent } from "vue";

export default defineComponent({
  name: "RenderMd",
  props: {
    source: {
      type: String,
    },
    admin: {
      type: Boolean,
    },
    inline: {
      type: Boolean,
    },
  },
  computed: {
    compiled() {
      if (!this.source) return ''
      const r = this.admin ? adminMd : userMd;
      const content = this.inline
        ? r.renderInline(this.source)
        : r.render(this.source);
      return content;
    },
  },
});
</script>
