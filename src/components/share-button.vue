<template>
  <span @click="shareEntry()" :disabled="disabled">
    <ion-icon :icon="shareIcon" :size="iconSize" />
    <ion-label>{{ counter }}</ion-label>
  </span>
</template>
<script>
import { IonLabel, IonIcon, toastController } from "@ionic/vue";
import { arrowRedoOutline } from "ionicons/icons";
import { defineComponent } from "vue";
import { Parse } from "../config/Consts";
import { useStore } from "../stores/";

import { Plugins } from "@capacitor/core";
const { Share } = Plugins;

export default defineComponent({
  name: "ShareButton",
  props: {
    link: {
      type: String,
      required: true,
    },
    iconSize: {
      type: String,
      required: true,
      default: "small",
    },
    counter: {
      type: Number,
      required: true,
    },
    pointer: {
      type: Parse.Pointer,
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
    };
  },
  setup() {
    const store = useStore();
    return {
      store,
      shareIcon: arrowRedoOutline,
    };
  },
  methods: {
    async shareEntry() {
      this.disabled = true;
      await Share.share({
        title: "See cool stuff",
        text: "Really awesome thing you need to see right meow",
        url: this.link,
        dialogTitle: "Share with buddies",
      }).then(
        () => {
          this.disabled = false;
          this.store.dispatch("auth/logShared", this.pointer);
        },
        async (err) => {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(this.link);
            const toast = await toastController.create({
              message: "Url zur Zwischenablage kopiert",
              duration: 2000,
            });
            toast.present();
            this.store.dispatch("auth/logShared", this.pointer);
          } else {
            console.error("Could not share", err);
            const toast = await toastController.create({
              color: "warning",
              message: "Url konnte nicht kopiert  werden.",
              duration: 2000,
            });
            toast.present();
          }
          this.disabled = false;
        }
      );
    },
  },
  components: {
    IonLabel,
    IonIcon,
  },
});
</script>
