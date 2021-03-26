<template>
  <ion-header>
    <ion-toolbar>
      <ion-input
        :value="title"
        @ion-change="title = $event.target.value"
        :placeholder="$t('faq.title.placeholder')"
      />
      <ion-button color="dark" fill="clear" @click="closeModal" slot="end">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <rich-editor
      :enabledActions="AllActions"
      @change="(v) => (text = v)"
      :startText="text"
    />
    <ion-chip v-for="(t, index) in tags" :key="t" @click="removeTag(index)">
      {{ t }} <ion-icon :icon="removeIcon"></ion-icon>
    </ion-chip>
    <ion-input
      v-model="newTag"
      @keyup.enter="addTag"
      :placeholder="$t('faq.addTag.placeholder')"
    />
    <ion-button @click="addTag" fill="clear" size="small">
      <ion-icon :icon="addIcon"></ion-icon>
    </ion-button>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button
        fill="outline"
        :disabled="!canSubmit"
        @click="saveAndClose"
        slot="end"
      >
        <ion-icon :icon="saveIcon" />
        <ion-label> {{ saveLabel || $t("faq.button.save") }}</ion-label>
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
  IonFooter,
  IonLabel,
  IonChip,
  modalController,
} from "@ionic/vue";
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  trashOutline as removeIcon,
  addCircleOutline as addIcon,
} from "ionicons/icons";
import { defineComponent } from "vue";
import { AllActions } from "./rich-editor.vue";
import RichEditor from "./rich-editor.vue";

export default defineComponent({
  name: "EditFaq",
  components: {
    IonContent,
    IonToolbar,
    IonInput,
    IonHeader,
    IonIcon,
    IonChip,
    IonButton,
    IonFooter,
    IonLabel,
    RichEditor,
  },
  props: {
    saveLabel: {
      type: String,
    },
    faq: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss();
      },
      saveIcon,
      closeIcon,
      addIcon,
      removeIcon,
      AllActions,
    };
  },
  data(props) {
    const tags = props.faq.tags || [];
    const text = props.faq.text || "";
    const title = props.faq.title || "";
    const data: any = {
      newTag: "",
      tags,
      text,
      title,
    };
    return data;
  },
  computed: {
    canSubmit(): boolean {
      return this.title.length > 0 && this.text.length > 0;
    },
  },
  methods: {
    addTag() {
      if (this.tags.indexOf(this.newTag) === -1) {
        this.tags.push(this.newTag);
      }
      this.newTag = "";
    },
    removeTag(index: number) {
      this.tags.splice(index, 1);
    },
    saveAndClose() {
      const data: any = {};
      ["title", "text", "tags"].forEach((key) => {
        data[key] = this[key];
      });
      modalController.dismiss(data);
    },
  },
});
</script>
