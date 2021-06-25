<template>
<div>
  <div v-for="obj in objects" :key="obj.objectId">
    <div v-if="obj.className == 'Poll'" data-cy-obj="poll">
      <poll :poll="obj" />
    </div>
    <div
        v-else-if="obj.className == 'Picture'"
        data-cy-obj="picture"
        class="picture"
    >
      <ion-img :src="obj.file.url" />
    </div>
    <div
        v-else-if="obj.className == 'Link'"
        data-cy-obj="link"
        class="link-preview"
    >
      <ion-thumbnail v-if="obj.previewImage">
        <ion-img :src="obj.previewImage.url" />
      </ion-thumbnail>
      <div class="ion-padding-start">
        <ion-icon :icon="linkIcon" color="secondary"></ion-icon>
        <span v-if="obj.siteName">{{ obj.siteName }}: </span>
        <a :href="obj.url">{{ obj.title }}</a>
        <p v-if="obj.previewText" class="ion-padding-start">
            {{ obj.previewText }}
        </p>
      </div>
    </div>
    <div v-else-if="obj.className == 'Document'" data-cy-obj="document">
        <ion-icon :icon="documentIcon" color="secondary"></ion-icon>
        <a :href="obj.url">{{ obj.title }}</a>
    </div>
    <div v-else>
      {{ $t("activity.unknownType") }}
      <ion-button v-if="isAnroid" fill="outline" :href="androidLink">{{
        $t("appPage.button.android")
      }}</ion-button>
      <ion-button v-else-if="isIos" fill="outline" :href="iosLink">{{
        $t("appPage.button.iOS")
      }}</ion-button>
      <ion-button v-else fill="outline" v-on:click="reload">{{
        $t("appPage.button.refresh")
      }}</ion-button>
    </div>
  </div>
</div>
</template>
<script>
import { defineComponent } from 'vue';

import {
  IonImg,
  IonIcon,
  IonThumbnail,
  isPlatform
} from "@ionic/vue";
import {
  linkOutline as linkIcon,
  documentOutline as documentIcon,
} from "ionicons/icons";
import { isAndroid, isIos } from "@/utils/platform";

import Poll from "./poll.vue";

export default defineComponent({
  props: {
    objects: {
      type: Array,
      required: false
    },
  },
  setup() {
    return {
      linkIcon,
      documentIcon,
      isAndroid,
      isIos,
    }
  },
  components: {
    IonImg,
    IonIcon,
    IonThumbnail,
    Poll
  },
  methods: {
    isPlatform: isPlatform,
    reload() {
      location.reload()
    }
  }
})
</script>
