<template>
<ion-grid>
  <ion-row>
    <ion-col>
      <ion-title>{{title}}</ion-title>
    </ion-col>
    <ion-col class="ion-text-end">
      <ion-button fill="clear" size="small" v-if="canEdit" title="Editieren"><ion-icon :icon="editIcon"/></ion-button>
      <ion-button @click="intendToClose" fill="clear" size="small" v-if="canClose" title="Schließen"><ion-icon :icon="closeIcon"/></ion-button>
      <slot name="extraButtons"></slot>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col size="12" class="ion-padding-start" v-if="text">
      <p>{{text}}</p>
    </ion-col>
    <ion-col size="12" class="ion-padding-start" v-if="outcome">
      <h3>Ergebnis:</h3>
      <p>{{outcome}}</p>
    </ion-col>
    <ion-col size="12">
      <ion-list>
        <ion-item v-for="(e, index) in options" :key="e" @click="toggleSelection(index)">
          <ion-checkbox v-if="!hasVoted && !showingResults" slot="start" :checked="selected.indexOf(index) !== -1" />
          <ion-checkbox disabled v-if="showingResults || hasVoted" slot="start" :checked="hasVotedFor(index)" />
          <div class="entry">
            <ion-label>{{e.title}}</ion-label>
            <ion-note v-if="e.text">{{e.text}}</ion-note>
            <ion-progress-bar color="secondary" v-if="showingResults" :value="calcResult(index)" />
          </div>
          <ion-note class="number" v-if="showingResults" slot="end">{{Math.abs(calcResult(index) * 100)}}% </ion-note>
        </ion-item>
      </ion-list>
    </ion-col>
  </ion-row>
  <ion-row>
    <ion-col>
      <ion-note>
        <span v-if="votedCount">{{votedCount}} haben abgestimmt.</span>
        Jede:r kann {{canMultiselect ? 'eine Option' : 'mehrere Optionen' }} auswählen.
        <span v-if="isAnonymous">Stimmen werden anonym gespeichert.</span>
        <span v-if="canReset">Die Stimme kann geändert werden.</span>
        <span v-if="willClose">Schließt <span style="text-decoration: underline">{{closesAt}}</span>.</span>
        <span v-if="isClosed">Geschlossen {{closesAt}}.</span>
      </ion-note>
    </ion-col>
    <ion-col class="ion-text-end">
      <ion-spinner v-if="loading" />
      <div class="ion-text-end" v-if="!loading && !showingResults">
        <ion-button
          v-if="!hasVoted"
          :disabled="!canSubmit"
          @click="submit"
          size="small"
          fill="outline"
        >Abstimmen</ion-button>
        <ion-button
          v-if="canShowResults"
          @click="wantsToShowResult = true"
          fill="clear"
          size="small"
        >Zwischenergebnis zeigen</ion-button>
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
    </ion-col>
  </ion-row>
</ion-grid>
</template>

<script lang="ts">
import {
  IonGrid, IonRow, IonCol, IonIcon,
  IonCheckbox, IonButton, IonNote, IonLabel, IonItem, IonList, IonTitle, IonSpinner,
  IonProgressBar, alertController
} from '@ionic/vue';
import {
  powerOutline as closeIcon,
  createOutline as editIcon,
} from 'ionicons/icons';

import { useStore } from '../stores/';
import { Parse } from '../config/Consts';
import { until, hasPassed } from "../utils/time";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Poll',
  components: {
    IonGrid, IonRow, IonCol, IonIcon,
    IonButton, IonLabel, IonNote, IonCheckbox, IonItem, IonList, IonTitle, IonSpinner, IonProgressBar
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
      editIcon, closeIcon, store,
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
    async intendToClose() {
      const alert = await alertController
        .create({
          header: 'Umfrage abschließen!',
          message: 'Willst Du die Umfrage wirklich abschließen?',
          inputs: [
            {
              name: "outcome",
              placeholder: 'optional das Ergebnis festhalten...',
            },
          ],
          buttons: [
            {
              text: 'Nope',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Jup',
              handler: async (data) => {
                const { outcome } = data;
                this.loading = true;
                const pollItem = await Parse.Cloud.run("vote:close", { id: this.poll.id, outcome });
                await this.store.commit("setItem", pollItem);
                this.loading = false;
              },
            },
          ],
        });
      return alert.present();
    },
    calcResult(index: number): number {
      const votersCount = (this.poll.get("hasVoted") || []).length;
      if (votersCount === 0) { return 0 }
      return ((this.poll.get("votes") || {})[index] || []).length / votersCount;
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
    canEdit(): boolean {
      if (!this.poll.id) {
        return false;
      }
      if (this.isClosed) {
        return false;
      }

      const userId = this.store.getters["auth/myId"];
      if (!userId) { return false }

      if (this.poll.get("author").id === userId){
        return true
      } else {
        return false
      }
    },
    canClose(): boolean {
      if (!this.poll.id) {
        return false;
      }
      if (this.poll.get("closedAt")) {
        return false
      }
      const userId = this.store.getters["auth/myId"];
      if (!userId)  { return false }

      if (this.poll.get("author").id === userId){
        return true
      } else {
        return false
      }
    },
    showingResults(): boolean {
      if (this.isClosed) {
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
    votedCount(): number  {
      return (this.poll.get("hasVoted") || "").length
    },
    isClosed(): boolean {
      return !!this.poll.get("closedAt") || this.poll.get("closesAt") && hasPassed(this.poll.get("closesAt"))
    },
    willClose(): boolean  {
      return !!this.poll.get("closesAt")
    },
    closesAt(): string {
      return until(this.poll.get("closesAt"))
    },
    isAnonymous(): boolean {
      return this.poll.get("isAnonymous");
    },
    canReset(): boolean {
      return (!this.isClosed && !this.poll.get("isAnonymous") && this.poll.get("allowChange"))
    },
    title(): string {
      return this.poll.get('title')
    },
    text(): string {
      return this.poll.get('text')
    },
    outcome(): string {
      return this.poll.get('outcome')
    },
    canMultiselect(): boolean {
      return this.poll.get('isMultiselect')
    },
    options(): Array<any> {
      return this.poll.get('options')
    },
    canShowResults(): boolean {
      return !this.isClosed && (this.poll.get('showResults') && this.poll.get("showsResultsWithoutVote"))
    },
    canSubmit(): boolean {
      return !this.isClosed && this.selected.length > 0
    },
  }
});

</script>
<style scoped>
.entry {
  flex-grow: 1;
}
.number {
  width: 5em;
}
</style>