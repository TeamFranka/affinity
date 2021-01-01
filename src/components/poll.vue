<template>
<div>
  <div class="ion-text-end">
    <slot name="extraButtons"></slot>
  </div>
  <ion-title>{{title}}</ion-title>

  <p class="ion-padding-start" v-if="text">{{text}}</p>
  <ion-list>
    <ion-item v-for="(e, index) in options" :key="e" @click="toggleSelection(index)">
      <ion-checkbox v-if="!showingResults" slot="start" :checked="selected.indexOf(index) !== -1" />
      <ion-checkbox disabled v-if="showingResults" slot="start" :checked="hasVotedFor(index)" />
      <div>
        <ion-label>{{e.title}}</ion-label>
        <ion-note v-if="e.text">{{e.text}}</ion-note>
      </div>
    </ion-item>
  </ion-list>
  <div class="ion-text-end" v-if="loading">
    <ion-spinner />
  </div>
  <div class="ion-text-end" v-if="!loading && !showingResults">
    <ion-button
      v-if="canShowResults"
      @click="wantsToShowResult = true"
      fill="clear"
      size="small"
    >Zwischenergebnis zeigen</ion-button>
    <ion-button
      v-if="!hasVoted"
      :disabled="!canSubmit"
      @click="submit"
      size="small"
      fill="outline"
    >Abstimmen</ion-button>
  </div>
  <div class="ion-text-end" v-if="!loading && showingResults">
    <ion-button
      v-if="!hasVoted && canShowResults"
      @click="wantsToShowResult = false"
      fill="clear"
      size="small"
    >ausblenden</ion-button>
    <ion-button
      v-if="hasVoted && canReset"
      @click="resetVote"
      fill="outline"
      size="small"
    >Stimme zurücknehmen</ion-button>
  </div>
</div>
</template>

<script lang="ts">
import {
  IonCheckbox, IonIcon, IonButton, IonNote, IonLabel, IonItem, IonList, IonTitle, IonSpinner,
} from '@ionic/vue';
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
} from 'ionicons/icons';

import { useStore } from '../stores/';
import { Parse } from '../config/Consts';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Poll',
  components: {
    IonButton, IonLabel, IonNote, IonCheckbox, IonItem, IonList, IonTitle, IonSpinner,
  },
  props: {
    poll:  {
      type: Object,
      required: true
    },
  },
  setup() {
    const store = useStore();
    return {
      saveIcon, closeIcon, addIcon, listIcon, store,
    }
  },
  data() {
    const selected: number[] = [];
    return {
      selected,
      wantsToShowResult: false,
      loading: false,
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
    },
    hasVotedFor(index: number): boolean {
      if (!this.hasVoted) {
        return false
      }
      const userId = this.store.getters["auth/myId"];
      // FIXME: add anonymous votes;
      return !!((this.poll.get("votes") || {})[index] || []).find((x: any) => x.userId == userId)
    },
    async submit() {
      this.loading = true;
      const votes: Record<number, number> = {};
      this.selected.forEach((k) => {
        votes[k] = 1
      });
      const pollItem = await Parse.Cloud.run("vote", { id: this.poll.id, votes });
      await this.store.commit("setItem", pollItem);
      this.loading = false;
    },
    async resetVote() {
      this.loading = true;
      const pollItem = await Parse.Cloud.run("vote:reset", { id: this.poll.id });
      await this.store.commit("setItem", pollItem);
      this.loading = false;
    }
  },
  computed: {
    showingResults(): boolean {
      if (this.poll.get("closedAt")) {
        return true
      }

      if (!this.poll.get('showResults')) {
        return false
      }
      return this.hasVoted || (this.canShowResults && this.wantsToShowResult)
    },
    hasVoted(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) {
        return false
      }

      return (this.poll.get("hasVoted") || []).indexOf(this.store.getters["auth/myId"]) !== -1
    },
    canReset(): boolean {
      return (!this.poll.get("isAnonymous") && this.poll.get("allowChange"))
    },
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
    },
  }
});

</script>