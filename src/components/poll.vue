<template>
  <ion-grid>
    <ion-row>
      <ion-col>
        <ion-title data-cy-role="title">{{ title }}</ion-title>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-button
          data-cy="editPoll"
          fill="clear"
          @click="editPoll"
          size="small"
          v-if="canEdit"
          :title="$t('poll.title.editAction')"
          ><ion-icon :icon="editIcon"
        /></ion-button>
        <ion-button
          @click="intendToClose"
          fill="clear"
          size="small"
          v-if="canClose"
          :title="$t('poll.title.closeAction')"
          ><ion-icon :icon="closeIcon"
        /></ion-button>
        <slot name="extraButtons"></slot>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col
        data-cy-role="desc"
        size="12"
        class="ion-padding-start"
        v-if="text"
      >
        <render-md :source="text" />
      </ion-col>
      <ion-col size="12" class="ion-padding-start" v-if="outcome">
        <h3>{{ $t("poll.title.result") }}</h3>
        <p>{{ outcome }}</p>
      </ion-col>
      <ion-col size="12">
        <ion-list>
          <ion-item
            v-for="(e, index) in options"
            :key="e"
            @click="toggleSelection(index)"
          >
            <ion-checkbox
              :data-cy="`opt-${index}-select`"
              v-if="!hasVoted && !showingResults"
              slot="start"
              :checked="selected.indexOf(index) !== -1"
            />
            <ion-checkbox
              disabled
              v-if="showingResults || hasVoted"
              slot="start"
              :checked="hasVotedFor(index)"
            />
            <div class="entry">
              <ion-label :data-cy="`opt-${index}-title`">{{
                e.title
              }}</ion-label>
              <ion-note v-if="e.text" :data-cy="`opt-${index}-desc`">{{
                e.text
              }}</ion-note>
              <ion-progress-bar
                color="secondary"
                v-if="showingResults"
                :value="calcResult(index)"
              />
            </div>
            <ion-note class="number" v-if="showingResults" slot="end"
              >{{ Math.abs(calcResult(index) * 100) }}%
            </ion-note>
          </ion-item>
        </ion-list>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col>
        <ion-note>
          <span v-if="votedCount">{{
            $t("poll.notes.votedCount", { count: votedCount })
          }}</span>
          <span v-if="canMultiselect">{{
            $t("poll.notes.canMultiSelect")
          }}</span>
          <span v-else>{{ $t("poll.notes.canNotMultiSelect") }}</span>
          <span v-if="isAnonymous">{{ $t("poll.notes.isAnon") }}</span>
          <span v-if="canReset">{{ $t("poll.notes.canReset") }}</span>
          <i18n-t tag="span" v-if="willClose" keypath="poll.notes.closes">
            <template v-slot:closesAt>
              <span style="text-decoration: underline">{{ closesAt }}</span>
            </template>
          </i18n-t>
          <span v-if="isClosed">{{
            $t("poll.notes.close", { closed: closesAt })
          }}</span>
        </ion-note>
      </ion-col>
      <ion-col class="ion-text-end">
        <ion-spinner v-if="loading" />
        <div class="ion-text-end" v-if="!loading && !showingResults">
          <ion-button
            v-if="!hasVoted"
            :disabled="!canSubmit"
            data-cy-role="submit"
            @click="submit"
            size="small"
            fill="outline"
            >{{ $t("poll.actions.vote") }}</ion-button
          >
          <ion-button
            v-if="canShowResults"
            @click="wantsToShowResult = true"
            fill="clear"
            size="small"
            >{{ $t("poll.actions.showResults") }}</ion-button
          >
        </div>
        <div class="ion-text-end" v-if="!loading && showingResults">
          <ion-button
            v-if="!hasVoted && canShowResults"
            @click="wantsToShowResult = false"
            fill="clear"
            size="small"
            >{{ $t("poll.actions.hideResults") }}</ion-button
          >
          <ion-button
            v-if="hasVoted && canReset"
            data-cy-role="reset"
            @click="resetVote"
            fill="outline"
            size="small"
            >{{ $t("poll.actions.resetVote") }}</ion-button
          >
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCheckbox,
  IonButton,
  IonNote,
  IonLabel,
  IonItem,
  IonList,
  IonTitle,
  IonSpinner,
  IonProgressBar,
  alertController,
  modalController,
} from "@ionic/vue";
import {
  powerOutline as closeIcon,
  createOutline as editIcon,
} from "ionicons/icons";
import { cloneDeep } from "lodash";

import RenderMd from "./render-md.vue";
import EditPoll from "./edit-poll.vue";
import { useStore } from "../stores/";
import { toModel } from "@/utils/model";
import { Parse } from "../config/Consts";
import { until, hasPassed } from "../utils/time";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Poll",
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonLabel,
    IonNote,
    IonCheckbox,
    IonItem,
    IonList,
    IonTitle,
    IonSpinner,
    IonProgressBar,
    RenderMd,
  },
  props: {
    poll: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {
      editIcon,
      closeIcon,
      store,
    };
  },
  data() {
    const selected: number[] = [];
    return {
      selected,
      wantsToShowResult: false,
      loading: false,
    };
  },
  methods: {
    toggleSelection(index: number) {
      const currently: number = this.selected.indexOf(index);
      if (currently === -1) {
        if (this.canMultiselect) {
          this.selected.push(index);
        } else {
          this.selected = [index];
        }
      } else {
        this.selected.splice(currently, 1);
      }
    },
    async editPoll() {
      const intermedPoll = cloneDeep(this.poll);
      const modal = await modalController.create({
        component: EditPoll,
        componentProps: {
          poll: intermedPoll,
          saveLabel: "Speichern",
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        const model = this.poll.prepareSave(res.data);
        await this.store.dispatch("updateModel", model);
      }
    },
    async intendToClose() {
      const alert = await alertController.create({
        header: this.$t("poll.close.header"),
        message: this.$t("poll.close.message"),
        inputs: [
          {
            name: "outcome",
            placeholder: this.$t("poll.close.outcomePlaceholder"),
          },
        ],
        buttons: [
          {
            text: this.$t("generic.cancel"),
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: this.$t("poll.close.agree"),
            handler: async (data) => {
              const { outcome } = data;
              this.loading = true;
              const pollItem = await Parse.Cloud.run("vote:close", {
                id: this.poll.objectId,
                outcome,
              });
              await this.store.commit("setItem", toModel(pollItem));
              this.loading = false;
            },
          },
        ],
      });
      return alert.present();
    },
    calcResult(index: number): number {
      const votersCount = (this.poll.hasVoted || []).length;
      if (votersCount === 0) {
        return 0;
      }
      return ((this.poll.votes || {})[index] || []).length / votersCount;
    },
    hasVotedFor(index: number): boolean {
      if (!this.hasVoted) {
        return false;
      }
      const userId = this.store.getters["auth/myId"];
      // FIXME: add anonymous votes;
      return !!((this.poll.votes || {})[index] || []).find(
        (x: any) => x.userId == userId
      );
    },
    async submit() {
      this.loading = true;
      const votes: Record<number, number> = {};
      this.selected.forEach((k) => {
        votes[k] = 1;
      });
      const pollItem = await Parse.Cloud.run("vote", {
        id: this.poll.objectId,
        votes,
      });
      await this.store.commit("setItem", toModel(pollItem));
      this.loading = false;
    },
    async resetVote() {
      this.loading = true;
      const pollItem = await Parse.Cloud.run("vote:reset", {
        id: this.poll.objectId,
      });
      await this.store.commit("setItem", toModel(pollItem));
      this.loading = false;
    },
  },
  computed: {
    canEdit(): boolean {
      if (!this.poll.objectId) {
        return false;
      }
      if (this.isClosed) {
        return false;
      }

      // FIXME: use poll.canEdit here instead...
      if ((this.poll.hasVoted || []).length == 0) {
        // only for as long as no one" has voted.
        const teamId = this.poll.team.objectId;
        const teamPerms = this.store.getters["auth/teamPermissions"][teamId];
        if (teamPerms && teamPerms.isAdmin) {
          return true;
        }
        const userId = this.store.getters["auth/myId"];
        if (!userId) {
          return this.poll.author.objectId === userId;
        }
      }
      return false;
    },
    canClose(): boolean {
      if (!this.poll.objectId) {
        return false;
      }
      if (this.poll.closedAt) {
        return false;
      }
      const userId = this.store.getters["auth/myId"];
      if (!userId) {
        return false;
      }

      if (this.poll.author.objectId === userId) {
        return true;
      } else {
        return false;
      }
    },
    showingResults(): boolean {
      if (this.isClosed) {
        return true;
      }

      if (!this.poll.showResults) {
        return false;
      }
      return this.hasVoted || (this.canShowResults && this.wantsToShowResult);
    },
    hasVoted(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) {
        return false;
      }

      return (
        (this.poll.hasVoted || []).indexOf(this.store.getters["auth/myId"]) !==
        -1
      );
    },
    votedCount(): number {
      return (this.poll.hasVoted || "").length;
    },
    isClosed(): boolean {
      return (
        !!this.poll.closedAt ||
        (this.poll.closesAt && hasPassed(this.poll.closesAt))
      );
    },
    willClose(): boolean {
      return !!this.poll.closesAt;
    },
    closesAt(): string {
      return until(this.poll.closesAt);
    },
    isAnonymous(): boolean {
      return this.poll.isAnonymous;
    },
    canReset(): boolean {
      return !this.isClosed && !this.poll.isAnonymous && this.poll.allowChange;
    },
    title(): string {
      return this.poll.title;
    },
    text(): string {
      return this.poll.text;
    },
    outcome(): string {
      return this.poll.outcome;
    },
    canMultiselect(): boolean {
      return this.poll.isMultiselect;
    },
    options(): Array<any> {
      return this.poll.options;
    },
    canShowResults(): boolean {
      return (
        !this.isClosed &&
        this.poll.showResults &&
        this.poll.showsResultsWithoutVote
      );
    },
    canSubmit(): boolean {
      return !this.isClosed && this.selected.length > 0;
    },
  },
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
