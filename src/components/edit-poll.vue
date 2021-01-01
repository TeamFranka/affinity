<template>
  <ion-header>
    <ion-toolbar>
      <ion-input
        :value="title"
        @ionChange="title = $event.target.value"
        placeholder="Umfragen-Titel"
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
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-textarea
            :value="text"
            @ionChange="text = $event.target.value"
            placeholder="Give further context" />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-list-header>
              Optionen
            </ion-list-header>
            <ion-item v-for="(e, index) in options" :key="e">
              <ion-icon slot="start" :icon="listIcon" />
              <div>
                <ion-input
                  :value="e.title"
                  @ionChange="e.title = $event.target.value"
                  placeholder="Optionstitel"
                />
                <ion-input
                  :value="e.text"
                  @ionChange="e.text = $event.target.value"
                  placeholder="optionale Beschreibung"
                />
              </div>
                <ion-button
                  color="dark"
                  fill="clear"
                  @click="removeOption(index)"
                  slot="end"
                >
                <ion-icon :icon="closeIcon" />
              </ion-button>
            </ion-item>
            <ion-item>
              <ion-button @click="addOption" fill="outline">
                <ion-icon :icon="addIcon" />
                weitere hinzufügen
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size-md="12">
          Einstellungen:
        </ion-col>
        <ion-col size-md="12">
          <ion-item>
            <ion-toggle
              :checked="isMultiselect"
              @ionChange="isMultiselect = !isMultiselect"
            />
            <ion-label>Mehrfach-Antwort erlauben</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-md="12">
          <ion-item>
            <ion-toggle
              :checked="isAnonymous"
              @ionChange="isAnonymous = !isAnonymous"
            />
            <ion-label>Anonyme Abstimmung</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-md="12">
          <ion-item>
            <ion-toggle
              :disabled="isAnonymous"
              :checked="allowChange"
              @ionChange="allowChange = !allowChange"
            />
            <ion-label>Antwort kann geändert werden</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-md="12">
          <ion-item>
            <ion-toggle
              :checked="showResults"
              @ionChange="showResults = !showResults"
            />
            <ion-label>Zwischenergebnis anzeigen</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-md="12">
          <ion-item>
            <ion-toggle
              :disabled="!showResults"
              :checked="showsResultsWithoutVote"
              @ionChange="showsResultsWithoutVote = !showsResultsWithoutVote"
            />
            <ion-label>ZW-Ergenbisanzeigen ohne Abstimmmung  </ion-label>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
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
  IonFooter, IonLabel, IonToggle, IonGrid, IonRow, IonCol, IonItem, IonList, IonListHeader,
} from '@ionic/vue';
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
} from 'ionicons/icons';

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse, dayjs } from "../config/Consts";
import InlineText from './inline-text.vue';

export default defineComponent({
  name: 'EditPoll',
  emits: ['save', 'dismiss'],
  components: {
    IonContent, IonToolbar, IonInput, IonHeader, IonTextarea, IonIcon,
    IonButton, IonFooter, IonLabel,
    IonToggle, IonGrid, IonRow, IonCol, IonItem, IonList, IonListHeader,
  },
  props: {
    saveLabel: {
      type: String,
    },
    poll:  {
      type: Object,
      required: true
    },
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss()
      },
      saveIcon, closeIcon, addIcon, listIcon,
    }
  },
  data(props) {
    const options = props.poll.get("options") || [];
    const text = props.poll.get("text") || "";
    const title = props.poll.get("title") || "";
    const data: any = {
      options, text, title
    };
    [
      'isMultiselect',
      'isAnonymous',
      'showResults',
      'randomizeOrder',
      'allowChange',
      'showsResultsWithoutVote',
    ].forEach((key) => {
      data[key] = props.poll.get(key)
    });
    return data;
  },
  computed: {
    canSubmit(): boolean {
      console.log(this.title,  this.options);
      return  this.title.length > 0 && this.options.length > 0
    },
  },
  methods: {
    saveAndClose() {
      const data: any = {};
      [
        'title',
        'text',
        'options',
        'isMultiselect',
        'isAnonymous',
        'showResults',
        'randomizeOrder',
        'allowChange',
        'showsResultsWithoutVote',
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