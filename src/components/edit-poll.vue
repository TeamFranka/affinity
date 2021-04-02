<template>
  <ion-header>
    <ion-toolbar>
      <ion-input
        :value="title"
        name="title"
        @ion-change="title = $event.target.value"
        :placeholder="$t('poll.title')"
      />
      <ion-button color="dark" fill="clear" @click="closeModal" slot="end">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col>
          <rich-editor
            :startText="text"
            @change="(v) => (text = v)"
            :placeholder="$t('poll.context.placeholder')"
          />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-list>
            <ion-list-header>
              {{ $t("poll.options.title") }}
            </ion-list-header>
            <ion-item v-for="(e, index) in options" :key="e">
              <ion-icon slot="start" :icon="listIcon" />
              <div>
                <ion-input
                  :value="e.title"
                  :name="`opt-${index}-title`"
                  required
                  @ion-change="e.title = $event.target.value"
                  :placeholder="$t('poll.options.title.placeholder')"
                />
                <ion-input
                  :value="e.text"
                  :name="`opt-${index}-desc`"
                  @ion-change="e.text = $event.target.value"
                  :placeholder="$t('poll.options.desc.placeholder')"
                />
              </div>
              <ion-button
                color="dark"
                fill="clear"
                :data-cy="`opt-${index}-remove`"
                @click="removeOption(index)"
                slot="end"
              >
                <ion-icon :icon="closeIcon" />
              </ion-button>
            </ion-item>
            <ion-item>
              <ion-button @click="addOption" data-cy="addOption" fill="outline">
                <ion-icon :icon="addIcon" />
                {{ $t("poll.button.addOption") }}
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size-sm="12">
          {{ $t("poll.settings.title") }}
        </ion-col>
        <ion-col size-sm="12">
          <ion-item>
            <ion-toggle
              :checked="isMultiselect"
              @ion-change="isMultiselect = !isMultiselect"
            />
            <ion-label>{{ $t("poll.settings.label.multiselect") }}</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-sm="12">
          <ion-item>
            <ion-toggle
              :checked="isAnonymous"
              @ion-change="isAnonymous = !isAnonymous"
            />
            <ion-label>{{ $t("poll.settings.label.anon") }}</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-sm="12">
          <ion-item>
            <ion-toggle
              :disabled="isAnonymous"
              :checked="allowChange"
              @ion-change="allowChange = !allowChange"
            />
            <ion-label>{{ $t("poll.settings.label.allowChange") }}</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-sm="12">
          <ion-item>
            <ion-toggle
              :checked="showResults"
              @ion-change="showResults = !showResults"
            />
            <ion-label>{{ $t("poll.settings.label.showResults") }}</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-sm="12">
          <ion-item>
            <ion-toggle
              :disabled="!showResults"
              :checked="showsResultsWithoutVote"
              @ion-change="showsResultsWithoutVote = !showsResultsWithoutVote"
            />
            <ion-label>{{
              $t("poll.settings.label.showsResultsWithoutVote")
            }}</ion-label>
          </ion-item>
        </ion-col>
        <ion-col size-sm="12" style="display: flex">
          <ion-item class="ion-padding-start">
            <ion-label>{{
              $t("poll.settings.label.closeAutomatically")
            }}</ion-label>
            <ion-datetime
              display-format="D MMM YYYY H:mm"
              :placeholder="$t('poll.settings.placeholder.closeAutomatically')"
              :min="new Date().toISOString()"
              :value="closesAt"
              @ion-change="closesAt = $event.target.value"
            ></ion-datetime>
          </ion-item>
          <ion-button
            v-if="!!closesAt"
            type="submit"
            size="small"
            fill="clear"
            @click="closesAt = null"
          >
            <ion-icon :icon="closeIcon" />
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button
        data-cy-role="submit"
        fill="outline"
        :disabled="!canSubmit"
        @click="saveAndClose"
        slot="end"
      >
        <ion-icon :icon="saveIcon" />
        <ion-label> {{ saveLabel || $t("poll.button") }}</ion-label>
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
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonList,
  IonListHeader,
  IonDatetime,
} from "@ionic/vue";
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
} from "ionicons/icons";
import { defineComponent } from "vue";
import { Model } from "@/utils/model";
import dayjs from "dayjs";
import RichEditor from "./rich-editor.vue";

export default defineComponent({
  name: "EditPoll",
  components: {
    IonContent,
    IonToolbar,
    IonInput,
    IonHeader,
    RichEditor,
    IonIcon,
    IonButton,
    IonFooter,
    IonLabel,
    IonDatetime,
    IonToggle,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonList,
    IonListHeader,
  },
  props: {
    saveLabel: {
      type: String,
    },
    poll: {
      type: Model,
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
      listIcon,
      dayjs,
    };
  },
  data(props) {
    const options = props.poll.options || [];
    const text = props.poll.text || "";
    const title = props.poll.title || "";
    const data: any = {
      options,
      text,
      title,
    };
    [
      "isMultiselect",
      "isAnonymous",
      "showResults",
      "randomizeOrder",
      "allowChange",
      "showsResultsWithoutVote",
      "closesAt",
    ].forEach((key) => {
      data[key] = props.poll[key];
    });
    return data;
  },
  computed: {
    canSubmit(): boolean {
      return (
        this.title.length > 0 &&
        this.options.length > 0 &&
        !this.options.find((x: any) => !x.title)
      );
    },
  },
  methods: {
    saveAndClose() {
      const data: any = {};
      [
        "title",
        "text",
        "options",
        "isMultiselect",
        "isAnonymous",
        "showResults",
        "randomizeOrder",
        "allowChange",
        "showsResultsWithoutVote",
      ].forEach((key) => {
        data[key] = this[key];
      });
      data.closesAt = this.closesAt ? dayjs(this.closesAt).toDate() : null;
      modalController.dismiss(data);
    },
    addOption() {
      this.options.push({ title: `Option ${this.options.length + 1}` });
    },
    removeOption(idx: number) {
      this.options.splice(idx, 1);
    },
  },
});
</script>
