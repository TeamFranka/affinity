<template>
  <chat-widget v-if="loaded" :config="config" />
</template>

<script lang="ts">
import ChatWidget from "../components/chat-widget.vue";
import { defineComponent } from "vue";

// import SideMenu from '../components/side-menu.vue';
import { Parse, ChatWidgetSettings } from "./Consts";

export default defineComponent({
  name: "x-affinity-chat-widget",
  data() {
    return {
      config: new ChatWidgetSettings(),
      loaded: false,
    };
  },
  components: {
    ChatWidget,
  },
  async created() {
    const configuration = await new Parse.Query(ChatWidgetSettings)
      .include("team")
      .get((window as any).AFFINITY_CHAT_WIDGET);
    this.config = configuration;
    this.loaded = true;
  },
});
</script>
