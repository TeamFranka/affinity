<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start" class="back-button">
        <ion-back-button @click="closeModal"/>
      </ion-buttons>
      <ion-title>
      {{title}}
      </ion-title>
      <ion-button
        slot="end"
        data-cy="submitPost"
        data-cy-role="submit"
        fill="outline"
        v-bind:disabled="!canSubmit"
        shape="round"
        size="small"
        @click="submitPost"
      >
        <ion-icon :icon="sendIcon"></ion-icon>
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <new-post ref="newPost" :can-change-visiblity="canChangeVisiblity" hide-send :teams="teams" />
  </ion-content>
</template>
<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonContent,
  IonBackButton,
  IonTitle,
  IonIcon,
  modalController
} from "@ionic/vue";
import {
  paperPlaneOutline as sendIcon
  } from 'ionicons/icons';
import NewPost from "./new-post.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NewPostModal",
  props: {
    teams: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
    },
    canChangeVisiblity: {
      type: Boolean,
    }
  },
  components: {
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonContent,
    IonBackButton,
    IonTitle,
    IonIcon,
    NewPost,
  },
  setup() {
    return {
      async submitPost(e: Event) {
        e.preventDefault();
        modalController.dismiss({action: "submit"});
      },
      closeModal: () => modalController.dismiss(),
      sendIcon,
    };
  },
  computed: {
    canSubmit(): boolean {
      return true
      //return (this.$refs.newPost as typeof NewPost).canSubmit
    }
  },
});
</script>
