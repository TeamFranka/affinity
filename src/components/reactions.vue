<template>
  <ion-chip
    outline
    v-for="r in reactions"
    :disabled="!canReact"
    :color="r.selected ? selectedColor : unselectedColor"
    :key="r.key"
    @click="r.selected ? unreact(r.key) : react(r.key)"
  >
    <ion-label>{{ r.key }} {{ r.count }}</ion-label>
  </ion-chip>
  <ion-button
    @click="selectEmoji"
    v-if="canReact"
    fill="clear"
    color="medium"
    class="plusButton"
  >
    <ion-icon :icon="plusIcon" size="small" />
  </ion-button>
</template>
<script lang="ts">
import {
  IonChip,
  IonLabel,
  IonIcon,
  modalController,
  IonButton,
} from "@ionic/vue";

import EmojiPickerModal from "./emoji-picker-modal.vue";
import { addOutline as plusIcon } from "ionicons/icons";
import { Parse } from "../config/Consts";
import { useStore } from "../stores/";
import { defineComponent } from "vue";

interface ReactionState {
  key: string;
  selected: boolean;
  count: number;
}

export default defineComponent({
  name: "Activity",
  emits: ["react", "unreact"],
  components: {
    IonChip,
    IonLabel,
    IonIcon,
    IonButton,
  },
  props: {
    selectedColor: {
      type: String,
      default: "dark",
    },
    unselectedColor: {
      type: String,
      default: "light",
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {
      store,
      plusIcon,
    };
  },
  computed: {
    reactions(): ReactionState[] {
      const reacts: Record<string, string[]> = this.item.reactions || {};
      const myId = this.store.getters["auth/myId"] || "";

      return Object.entries(reacts || {}).map(([key, reactors]) => {
        return {
          key,
          selected: reactors.indexOf(myId) !== -1,
          count: reactors.length,
        };
      });
    },
    pointer(): Parse.Pointer {
      return this.item.toPointer();
    },
    canReact(): boolean {
      return true;
      // const team = this.item.team;
      // const settings = this.store.getters["auth/teamPermissions"][team.objectId];
      // return settings ? settings.canReact : false;
    },
  },
  methods: {
    async selectEmoji() {
      const popover = await modalController.create({
        component: EmojiPickerModal,
      });
      popover.present();
      const result = await popover.onDidDismiss();
      if (result.data) {
        this.react(result.data);
      }
    },
    react(reaction: string) {
      this.store.dispatch(
        "auth/react",
        Object.assign({ reaction }, this.pointer)
      );
    },
    unreact(reaction: string) {
      this.store.dispatch(
        "auth/unreact",
        Object.assign({ reaction }, this.pointer)
      );
    },
  },
});
</script>
<style scoped>
.plusButton {
  height: 32px;
  vertical-align: middle;
}
</style>
