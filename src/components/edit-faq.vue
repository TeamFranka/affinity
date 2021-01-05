<template>
  <ion-header>
    <ion-toolbar>
      <ion-input
        :value="title"
        @ionChange="title = $event.target.value"
        placeholder="Fragen-Titel"
      />
      <ion-button
        color="dark"
        fill="clear"
        @click="closeModal"
        slot="end"
      >
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-textarea
    :value="text"
    @ionChange="text = $event.target.value"
    placeholder="Antwort Text" />
    <ion-chip v-for="(t, index) in tags" :key="t" @click="removeTag(index)">
        {{t}} <ion-icon :icon="removeIcon"></ion-icon>
    </ion-chip>
    <ion-input v-model="newTag" @keyup.enter="addTag" placeholder="add tags"/>
    <ion-button @click="addTag" fill="clear" size="small">
        <ion-icon :icon="addIcon"></ion-icon>
    </ion-button>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button fill="outline" :disabled='!canSubmit' @click="saveAndClose" slot="end">
        <ion-icon :icon="saveIcon" />
        <ion-label> {{saveLabel || "Save"}}</ion-label>
      </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import {
  IonContent, IonHeader, IonToolbar, IonInput, IonIcon, IonButton, IonTextarea, modalController,
  IonFooter, IonLabel,
} from '@ionic/vue';
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  trashOutline as removeIcon,
  addCircleOutline as addIcon,
} from 'ionicons/icons';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditFaq',
  components: {
    IonContent, IonToolbar, IonInput, IonHeader, IonTextarea, IonIcon,
    IonButton, IonFooter, IonLabel,
  },
  props: {
    saveLabel: {
      type: String,
    },
    faq:  {
      type: Object,
      required: true
    },
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss()
      },
      saveIcon, closeIcon, addIcon, removeIcon,
    }
  },
  data(props) {
    const tags = props.faq.get("tags") || [];
    const text = props.faq.get("text") || "";
    const title = props.faq.get("title") || "";
    const data: any = {
        newTag: '', tags, text, title
    };
    return data;
  },
  computed: {
    canSubmit(): boolean {
      return  this.title.length > 0 && this.text.length > 0
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
      [
        'title',
        'text',
        'tags',
      ].forEach((key) => {
        data[key] = this[key]
      });
      modalController.dismiss(data);
    },
    addOption() {
      this.options.push({title: `Option ${this.options.length + 1}`});
    },
    removeOption(idx: number) {
      this.options.splice(idx, 1);
    }
  }
});
</script>