<template>
  <ion-list>
    <ion-item v-if="isBookmarked" data-cy-role="unbookmark" button @click="unbookmark">
      <ion-icon color="success" :icon="bookmarkIcon" slot="start" />
      <i18n-t keypath="activity.extras.bookmarked" />
    </ion-item>
    <ion-item v-else data-cy-role="bookmark" button @click="bookmark">
      <ion-icon color="dark" :icon="bookmarkIcon" slot="start" />
      <i18n-t keypath="activity.extras.bookmark" />
    </ion-item>
  </ion-list>
</template>
<script lang="ts">
import {
  IonList,
  IonIcon,
  IonItem,
  popoverController,
} from "@ionic/vue";
import {
  checkmarkOutline as check,
  bookmark as bookmarkIcon,
} from "ionicons/icons";

import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";
import { Model } from "@/utils/model";

export default defineComponent({
  name: "ActivityExtrasMenu",
  props: {
    activity: {
      type: Model,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      store,
      bookmarkIcon,
      check,
    };
  },
  computed:{
    isBookmarked(): boolean {
      return !!this.activity.bookmarked
    },
  },
  methods: {
    bookmark() {
      this.store.dispatch("auth/bookmark", this.activity.toPointer());
      popoverController.dismiss();
    },
    unbookmark() {
      this.store.dispatch("auth/unbookmark", this.activity.toPointer());
      popoverController.dismiss();
    }
  },
  components: {
    IonList,
    IonIcon,
    IonItem,
  }
});
</script>