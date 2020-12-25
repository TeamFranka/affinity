<template>
  <ion-grid class="new-post">
    <ion-row>
      <ion-col size="11">
        <ion-textarea auto-grow=true :value="text" @change="updateText" placeholder="What do you want to share?" />
      </ion-col>
      <ion-col size="1">
        <ion-button @click="submit()" fill="outline" v-bind:disabled="!canSubmit" shape="round" size="small">
          <ion-icon :icon="sendIcon"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row v-if="showTeamSelector || showTypeSelector">
      <ion-col size="3" v-if="showTypeSelector">
        <selector
            label="as"
            popoverTitle="Select"
            @select="selectType($event)"
            :items="selectableTypes"
        >
          <template #title>
            <ion-label>
              <ion-icon :icon="VERB_ICONS[selectedType]"></ion-icon>
              {{selectedType}}</ion-label>
          </template>
          <template #item="sProps">
            <span
              @click="sProps.select(sProps.item)"
              :key="sProps.item"
            >
              <ion-icon :icon="VERB_ICONS[sProps.item]"></ion-icon>
              {{sProps.item}}
            </span>
          </template>
        </selector>
      </ion-col>
      <ion-col size="2" v-if="!showTypeSelector">
        Post
      </ion-Col>
      <ion-col size="4" v-if="showTeamSelector">
        <selector
            label="to"
            @select="selectTeam($event)"
            :items="teams"
        >
          <template #title>
            <avatar :profile="selectedTeam" withName />
          </template>
          <template #item="sProps">
              <avatar :profile="sProps.item" withName @click="sProps.select(sProps.item)" />
          </template>
        </selector>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="1">
        <ion-label ion-text-muted>Add</ion-label>
      </ion-col>
      <ion-col size="10">
        <ion-chip @click="addPicture()" color="secondary" outline>
          <ion-icon :icon="imageIcon" color="secondary"></ion-icon>
          <ion-label>Image</ion-label>
        </ion-chip>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="3" v-for="img in images" v-bind:key="img.file.dataUrl">
          <ion-img :src="img.file.dataUrl" />
          <ion-input placeholder="description" v-model="img.description"></ion-input>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>


<script lang="ts">
import {
  IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import {
  image as imageIcon, readerOutline, paperPlaneOutline as sendIcon, newspaperOutline
} from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import Selector from "./selector.vue";
import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { Parse, Verb, Visibility } from '../config/Consts';

const VERB_ICONS: Record<string, any>= {};
VERB_ICONS[Verb.Post] = readerOutline;
VERB_ICONS[Verb.Announce] = newspaperOutline;

export default defineComponent({
  name: 'DraftPost',
  emits: ["submitted"],
  setup() {
    const store = useStore();
    return {
      store,
      VERB_ICONS,
      teams: computed(() => store.getters["auth/postableTeams"]),
      text: computed(() => store.state.draft.text),
      selectedType: computed(() => store.getters["draft/selectedType"]),
      visibility: computed(() => store.state.draft.visibility),
      images: computed(() => store.state.draft.images),
      updateText: (e: any) => store.commit("draft/setText", e.target.value),
      selectTeam: (t: Parse.Object) => store.commit("draft/setTeam", t),
      setVisbility: (t: Visibility) => store.commit("draft/setVisibility", t),
      selectType: (t: Verb) => store.commit("draft/setType", t),
      selectedTeam: computed(() => store.getters["draft/selectedTeam"]),
      selectedTeamId: computed(() => store.getters["draft/selectedTeamId"]),
      selectableTypes: computed(() => store.getters["draft/selectableTypes"]),
      showTypeSelector: computed(() => store.getters["draft/showTypeSelector"]),
      addPicture() { store.dispatch("draft/addPicture"); },
      submit() { store.dispatch("draft/submit"); },
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      showTeamSelector: computed(() => store.getters["auth/hasManyTeams"]),
      imageIcon, sendIcon
    }
  },
  components: {
    IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg,
    IonGrid, IonRow, IonCol, Selector, Avatar
  }
});
</script>
<style scoped>
.new-post {
  max-width: 1080px;
  margin: 0 auto;
}
</style>