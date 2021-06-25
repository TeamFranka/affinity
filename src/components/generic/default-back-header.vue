<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button
            :default-href="defaultHref"
            :text="text"
            :icon="icon">
        </ion-back-button>
      </ion-buttons>
      <slot></slot>
    </ion-toolbar>
  </ion-header>
</template>
<script lang="ts">
import { IonHeader, IonBackButton, IonToolbar, IonButtons, } from "@ionic/vue";
import { defineComponent } from 'vue';

export default defineComponent({
  name: "BackHeader",
  components: {
    IonHeader,
    IonBackButton,
    IonToolbar,
    IonButtons,
  },
  props: {
    defaultHref: {
      default: "/",
    },
    text: {
      default: undefined
    },
    icon: {
      default: undefined
    },
  },
})
</script>
