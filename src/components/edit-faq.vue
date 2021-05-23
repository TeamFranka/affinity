<template>
  <ion-header>
    <ion-toolbar>
      <ion-input
        :value="title"
        name="title"
        @ion-change="title = $event.target.value"
        :placeholder="$t('faq.title.placeholder')"
      />
      <ion-button color="dark" fill="clear" @click="closeModal" slot="end">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div>
      <selector
        label="Team"
        popoverTitle="Team"
        @select="team = $event"
        :items="teams"
        data-cy="selectTeam"
      >
        <template #current>
          <avatar :profile="selectedTeam" size="2em" withName />
        </template>
        <template #item="sProps">
          <ion-item @click="sProps.select(sProps.item)" button>
            <avatar :profile="sProps.item" size="2em" withName />
            <ion-icon
              v-if="sProps.item.objectId == team.objectId"
              slot="end"
              :icon="selectedIcon"
            />
          </ion-item>
        </template>
      </selector>
    </div>
    <div>
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
    </div>

    <rich-editor
      :enabledActions="AllActions"
      @change="(v) => (text = v)"
      :startText="text"
    />
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
  IonItem,
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
import Avatar from "./avatar.vue";
import Selector from "@/components/generic/selector.vue";
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
    Selector,
    Avatar,
    IonItem,
  },
  props: {
    saveLabel: {
      type: String,
    },
    faq: {
      type: Object,
      required: true,
    },
    teams: {
      type: Array,
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
    const team = props.faq.team;
    const data: any = {
      newTag: "",
      tags,
      text,
      title,
      team,
    };
    return data;
  },
  computed: {
    canSubmit(): boolean {
      return this.title.length > 0 && this.text.length > 0;
    },
    selectedTeam(): any{
      return this.teams.find((x: any) => x.objectId == this.team.objectId)
    }
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
      ["title", "text", "tags", "team"].forEach((key) => {
        data[key] = this[key];
      });
      modalController.dismiss(data);
    },
  },
});
</script>
