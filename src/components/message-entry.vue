<template>
  <div :class="clsName">
    <div class="meta">
      <avatar v-if="!isMine" :profile="author" size="2em" with-name />
      {{ smartTimestamp(message.createdAt) }}
    </div>
    <div class="message">
      <render-md v-if="message.text" :source="message.text" />
      <render-objects v-if="message.objects" :objects="message.objects" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Model } from "@/utils/model";
import { smartTimestamp } from "@/utils/time";
import { useStore } from "@/stores/";
import Avatar from "./avatar.vue";
import RenderObjects from "./render-objects.vue";
//import InteractionBar from "./interaction-bar.vue";
import RenderMd from "./render-md.vue";

export default defineComponent({
  props: {
    message: {
      type: Model,
      required: true,
    }
  },
  setup() {
    const store = useStore();

    return {
      store,
      smartTimestamp,
    }
  },
  computed: {
    clsName(): string {
      return this.isMine ? "entry mine" : "entry";
    },
    author(): Model {
      return this.store.getters.objectsMap[this.message.author.objectId];

    },
    isMine(): boolean {
      return this.message.author.objectId == this.store.getters["auth/myId"];
    }

  },
  components: {
    Avatar,
    RenderObjects,
    RenderMd,

  },
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column-reverse;
}

.entry {
  display: flex;
  flex-direction: column;
  margin: 0.25em;
  align-self: start;
}

.message {
  padding: 0.5rem 1rem;
  background: var(--ion-color-light);
}

.entry .message {
  border-radius: 1rem 1rem 1rem 0;
}

.entry.mine {
  text-align: right;
  align-self: flex-end;
}

.entry.mine .message {
  border-radius: 1rem 1rem 0 1rem;
}

.meta {
  font-size: 0.75em;
  color: var(--ion-color-medium);
}
</style>

