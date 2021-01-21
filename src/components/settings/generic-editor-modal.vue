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
    <ion-item v-if="type == 'textarea'">
      <ion-label position="stacked">{{label}}</ion-label>
      <ion-textarea
        :placeholder="placeholder"
        :value="currentValue"
        auto-grow
        @ionchange="currentValue = $event.target.value"
      />
    </ion-item>
    <ion-item v-else>
      <ion-label position="stacked">{{label}}</ion-label>
        <ion-input
          :type="type"
          :value="currentValue"
          :placeholder="placeholder"
          @ionchange="currentValue = $event.target.value"
        />
    </ion-item>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button fill="outline" @click="saveAndClose" slot="end">
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

export default defineComponent({
  name: 'IconSelector',
  components: {
    IonContent, IonToolbar, IonInput, IonHeader, IonIcon, IonTextarea,
    IonButton, IonFooter, IonLabel, IonItem, IonTitle,
  },
  props: {
    title: {
      type: String,
      default: "Ändern"
    },
    label: {
      type: String,
      default: "Edit:"
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
    }
  },
  methods: {
    saveAndClose() {
      modalController.dismiss({value: this.currentValue});
    },
  },
});
</script>