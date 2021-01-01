<template>
<div>
  <div class="ion-text-end">
    <slot name="extraButtons"></slot>
  </div>
  <ion-title>{{title}}</ion-title>

  <p class="ion-padding-start" v-if="text">{{text}}</p>
  <ion-list>
    <ion-item v-for="(e, index) in options" :key="e" @click="toggleSelection(index)">
      <ion-checkbox slot="start" :checked="selected.indexOf(index) !== -1" />
      <div>
        <ion-label>{{e.title}}</ion-label>
        <ion-note v-if="e.text">{{e.text}}</ion-note>
      </div>
    </ion-item>
  </ion-list>
  <div class="ion-text-end">
    <ion-button v-if="canShowResults" fill="clear" size="small" slot="end">Zwischenergebnis zeigen</ion-button>
    <ion-button :disabled="!canSubmit" size="small" fill="outline" slot="end">Abstimmen</ion-button>
  </div>
</div>
</template>

<script lang="ts">
import {
  IonCheckbox, IonIcon, IonButton, IonNote, IonLabel, IonItem, IonList, IonTitle,
} from '@ionic/vue';
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
} from 'ionicons/icons';

import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Poll',
  components: {
    IonButton, IonLabel, IonNote, IonCheckbox, IonItem, IonList, IonTitle,
  },
  props: {
    poll:  {
      type: Object,
      required: true
    },
  },
  setup() {
    return {
      saveIcon, closeIcon, addIcon, listIcon,
    }
  },
  data() {
    const selected: number[] = [];
    return {
      selected,
    }
  },
  methods:{
    toggleSelection(index: number) {
      const currently: number = this.selected.indexOf(index);
      if (currently === -1) {
        if (this.canMultiselect) {
          this.selected.push(index);
        } else {
          this.selected = [index];
        }
      } else {
        this.selected.splice(currently, 1)
      }
    }
  },
  computed: {
    title(): string {
      return this.poll.get('title')
    },
    text(): string {
      return this.poll.get('text')
    },
    canMultiselect(): boolean {
      return this.poll.get('isMultiselect')
    },
    options(): Array<any> {
      return this.poll.get('options')
    },
    canShowResults(): boolean {
      return this.poll.get('showResults') && this.poll.get("showsResultsWithoutVote")
    },
    canSubmit(): boolean {
      return this.selected.length > 0
    }
  }
});

</script>