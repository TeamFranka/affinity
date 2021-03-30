<template>
  <ion-header>
    <ion-toolbar>
      <ion-button slot="end" fill="clear" @click="closeModal">
        <ion-icon :icon="closeIcon" color="medium" />
      </ion-button>
      <ion-searchbar
        show-cancel-button="focus"
        :placeholder="$t('emoji.search.placeholder')"
        inputmode="search"
        enterkeyhint="search"
        :value="searchValue"
        @ion-change="searchValue = $event.target.value"
      />
    </ion-toolbar>
    <ion-segment :value="selectedGroup" scrollable>
      <ion-segment-button
        v-for="e in EmojiGroups"
        :key="e.group"
        :value="e.group"
        @click="selectedGroup = e.group"
        >{{ e.description }}</ion-segment-button
      >
    </ion-segment>
  </ion-header>
  <ion-content>
    <span
      v-for="e in visibleIcons"
      :key="e.unicode"
      @click="selectEmoji(e.unicode)"
      class="emoji"
      >{{ e.unicode }}</span
    >
  </ion-content>
</template>

<script>
import {
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonHeader,
  IonButton,
  IonIcon,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { closeCircleOutline as closeIcon } from "ionicons/icons";
import EmojiGroups from "../statics/emoji/emoji-groups.json";
import EmojiAllData from "../statics/emoji/emoji-all-groups.json";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmojiPickerModal",
  components: {
    IonSearchbar,
    IonContent,
    IonHeader,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonIcon,
    IonToolbar,
  },
  data() {
    return {
      searchValue: "",
      selectedGroup: 0,
    };
  },
  setup() {
    return {
      EmojiAllData,
      EmojiGroups,
      closeIcon,
    };
  },
  computed: {
    visibleIcons() {
      if (this.searchValue.length) {
        const v = this.searchValue;
        const foundIcons = [];
        EmojiAllData.forEach((g) => {
          g.emojiList
            .filter((i) => !!i.tags.find((t) => t.includes(v)))
            .forEach((x) => foundIcons.push(x));
        });
        return foundIcons;
      }
      return EmojiAllData[this.selectedGroup].emojiList;
    },
  },
  methods: {
    closeModal() {
      modalController.dismiss();
    },
    selectEmoji(emoji) {
      modalController.dismiss(emoji);
    },
  },
});
</script>
<style scoped>
.emoji {
  display: inline-block;
  font-size: 1.8em;
  margin: 3px;
  cursor: pointer;
}
</style>
