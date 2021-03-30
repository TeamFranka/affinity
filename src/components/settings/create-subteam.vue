<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ $t("admin.createSubteam.title") }}</ion-title>
      <ion-button color="dark" fill="clear" @click="closeModal" slot="end">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label position="stacked">{{
        $t("admin.createSubteam.label.name")
      }}</ion-label>
      <ion-input
        data-cy-role="name"
        :value="name"
        required
        @ion-change="name = $event.target.value"
      />
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{
        $t("admin.createSubteam.label.slug")
      }}</ion-label>
      <ion-input
        data-cy-role="slug"
        required
        :value="slug"
        @ion-change="setSlug($event.target.value)"
      />
    </ion-item>
    <ion-label>{{ $t("admin.createSubteam.label.details") }}</ion-label>
    <rich-editor
      :isAdminMd="true"
      :enabledActions="AllActions"
      :debounce="0"
      @change="
        (x) => {
          info = x;
        }
      "
    />
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button
        data-cy-role="submit"
        fill="outline"
        @click="saveAndClose"
        slot="end"
      >
        <ion-icon :icon="saveIcon" />
        <ion-label>{{ $t("admin.createSubteam.button.create") }}</ion-label>
      </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonIcon,
  IonButton,
  modalController,
  IonFooter,
  IonLabel,
  IonItem,
  IonTitle,
} from "@ionic/vue";
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
  trashOutline as removeIcon,
} from "ionicons/icons";
import { defineComponent } from "vue";
import { DefaultActions, AllActions } from "../rich-editor.vue";
import RichEditor from "../rich-editor.vue";

export default defineComponent({
  name: "IconSelector",
  components: {
    IonContent,
    IonToolbar,
    IonInput,
    IonHeader,
    IonIcon,
    IonButton,
    IonFooter,
    IonLabel,
    IonItem,
    IonTitle,
    RichEditor,
  },
  data() {
    return {
      name: "",
      slug: "",
      info: "",
    };
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss();
      },
      saveIcon,
      closeIcon,
      addIcon,
      listIcon,
      removeIcon,
      DefaultActions,
      AllActions,
    };
  },
  methods: {
    setSlug(text: string) {
      const stripped = text
        .toLowerCase()
        .trim()
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[\s\W-]+/g, "-"); // Replace spaces, non-word characters and dashes with a single dash (-)
      this.slug = stripped;
    },
    saveAndClose() {
      modalController.dismiss({
        name: this.name,
        slug: this.slug,
        info: this.info,
      });
    },
  },
});
</script>
