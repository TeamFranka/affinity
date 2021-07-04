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

    <ion-item-group v-if="isPostAdmin" >
      <ion-item-divider>
        <ion-label color="danger"><i18n-t keypath="activity.extras.adminActions" /></ion-label>
      </ion-item-divider>
      <ion-item data-cy-role="published" button @click="bookmark">
        <ion-label><i18n-t keypath="activity.extras.changePublishedAt" /></ion-label>
        <ion-datetime
          display-format="DD.MMM, YYYY HH:mm"
          :value="activity.publishedAt.iso"
          doneText="Save"
          @ion-change="dateUpdated($event.detail.value)"
        />
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>
<script lang="ts">
import {
  IonList,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  popoverController,
  IonDatetime,
} from "@ionic/vue";
import {
  checkmarkOutline as check,
  bookmark as bookmarkIcon,
} from "ionicons/icons";

import { useStore } from "@/stores/";
import { defineComponent, computed } from "vue";
import { makeJsDate } from  "@/utils/time";
import { Model } from "@/types/model";

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
    isPostAdmin(): boolean {
      return this.store.getters["auth/teamPermissions"][this.activity.team.objectId]?.isAdmin
    }
  },
  methods: {
    bookmark() {
      this.store.dispatch("auth/bookmark", this.activity.toPointer());
      popoverController.dismiss();
    },
    unbookmark() {
      this.store.dispatch("auth/unbookmark", this.activity.toPointer());
      popoverController.dismiss();
    },
    async dateUpdated(dt: string) {
      console.log(dt);
      const saveModel = this.activity.prepareSave({publishedAt: makeJsDate(dt)});
      await this.store.dispatch("updateModel", saveModel);
    }
  },
  components: {
    IonList,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonDatetime,
  }
});
</script>