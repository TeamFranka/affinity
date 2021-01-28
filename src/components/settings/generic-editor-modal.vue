<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{title}}</ion-title>
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
    <ion-item>
      <render-md v-if="help" admin :source="help" />
      <ion-label position="stacked">{{label}}</ion-label>
      <rich-editor
        v-if="type == 'richtext'"
        :placeholder="placeholder"
        :startText="currentValue"
        :isAdminMd="isAdminMd"
        :enabledActions="isAdminMd ? AllActions : DefaultActions"
        :debounce="0"
        @change="(x) => { currentValue = x}"
      />
      <ion-textarea
        v-else-if="type == 'textarea'"
        data-cy-role="edit"
        :placeholder="placeholder"
        :value="currentValue"
        auto-grow
        @ionchange="currentValue = $event.target.value"
      />
      <ion-input
        v-else
        data-cy-role="edit"
        :type="type"
        :value="currentValue"
        :placeholder="placeholder"
        @ionchange="currentValue = $event.target.value"
      />
    </ion-item>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button data-cy-role="submit" fill="outline" @click="saveAndClose" slot="end">
        <ion-icon :icon="saveIcon" />
        <ion-label> {{saveLabel || "Speichern"}}</ion-label>
      </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import {
  IonContent, IonHeader, IonToolbar, IonInput, IonIcon, IonButton, modalController,
  IonFooter, IonLabel, IonItem, IonTextarea, IonTitle
} from '@ionic/vue';
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
  trashOutline as removeIcon,
} from 'ionicons/icons';
import { defineComponent } from 'vue';
import { DefaultActions, AllActions } from '../rich-editor.vue';
import RichEditor from '../rich-editor.vue';
import RenderMd from '../render-md.vue';

export default defineComponent({
  name: 'IconSelector',
  components: {
    IonContent, IonToolbar, IonInput, IonHeader, IonIcon, IonTextarea,
    IonButton, IonFooter, IonLabel, IonItem, IonTitle, RichEditor, RenderMd,
  },
  props: {
    title: {
      type: String,
      default: "Ändern"
    },
    label: {
      type: String,
    },
    help: {
      type: String,
    },
    saveLabel: {
      type: String,
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "please enter"
    },
    value: {
      type: String,
    },
    isAdminMd: {
      type: Boolean
    },
  },
  data(props) {
    return {
      currentValue: props.value
    }
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss()
      },
      saveIcon, closeIcon, addIcon, listIcon, removeIcon,
      DefaultActions, AllActions,
    }
  },
  methods: {
    saveAndClose() {
      modalController.dismiss({value: this.currentValue});
    },
  },
});
</script>