<template>
  <ion-grid class="new-post">
    <ion-row>
      <ion-col size-md="11" size-xs="10">
        <ion-textarea auto-grow=true :value="text" @change="updateText" placeholder="What do you want to share?" />
        <p @click="showOptions = true" v-if="!showOptions">{{visibility}} {{selectedType}} to <avatar size="1.5em" :profile="selectedTeam" withName /><ion-icon :icon="editIcon"/></p>
      </ion-col>
      <ion-col size-md="1" class="ion-hide-sm-down">
        <ion-button @click="submit()" fill="outline" v-bind:disabled="!canSubmit" shape="round" size="small">
          <ion-icon :icon="sendIcon"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row v-if="showOptions">
      <ion-col size-md="4" size-xs="12">
        <selector
            @select="setVisibility($event)"
            popoverTitle="Visibility"
            :items="selectableVisibility"
        >
          <template #label>
              <ion-icon :icon="eyeOutline" />
              <ion-label>Sichtbar: </ion-label>
          </template>
          <template #current>
            <ion-label>
              <ion-icon :icon="VISIBILITY_ICONS[visibility]"></ion-icon>
              {{visibility}}
            </ion-label>
          </template>
          <template #item="sProps">
            <ion-item
              @click="sProps.select(sProps.item)"
              :key="sProps.item"
              button
            >
              <ion-icon slot="start" :icon="VISIBILITY_ICONS[sProps.item]"></ion-icon>
              {{sProps.item}}
              <ion-icon v-if="sProps.item == visibility" slot="end" :icon="selectedIcon" />
            </ion-item>
          </template>
        </selector>
      </ion-col>
      <ion-button
        :style="{position: 'absolute', right: '1em', 'z-index': 1}"
        size="small"
        fill="clear"
        @click="showOptions = false"
      >
        <ion-icon :icon="closeIcon"/>
      </ion-button>
      <ion-col size-md="3" size-xs="12" v-if="showTypeSelector">
        <selector
            label="Type"
            popoverTitle="Post Type"
            @select="selectType($event)"
            :items="selectableTypes"
        >
          <template #current>
            <ion-label>
              <ion-icon :icon="VERB_ICONS[selectedType]"></ion-icon>
              {{selectedType}}
            </ion-label>
          </template>
          <template #item="sProps">
            <ion-item
              @click="sProps.select(sProps.item)"
              :key="sProps.item"
              button
            >
              <ion-icon slot="start" :icon="VERB_ICONS[sProps.item]" />
              {{sProps.item}}
              <ion-icon v-if="sProps.item == selectedType" slot="end" :icon="selectedIcon" />
            </ion-item>
          </template>
        </selector>
      </ion-col>
      <ion-col size="3" v-if="!showTypeSelector">
        Post
      </ion-Col>
      <ion-col size-md="4" size-xs="12" v-if="showTeamSelector">
        <selector
            label="Team"
            popoverTitle="Team"
            @select="selectTeam($event)"
            :items="teams"
        >
          <template #current>
            <avatar :profile="selectedTeam" size="2em" withName />
          </template>
          <template #item="sProps">
            <ion-item
              @click="sProps.select(sProps.item)"
              button
            >
              <avatar :profile="sProps.item" size="2em" withName />
              <ion-icon v-if="sProps.item == selectedTeam" slot="end" :icon="selectedIcon" />
            </ion-item>
          </template>
        </selector>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="3" v-for="img in images" v-bind:key="img.file.dataUrl">
        <ion-img :src="img.file.dataUrl" />
        <ion-input placeholder="description" v-model="img.description"></ion-input>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size-sm="12" size-xs="10">
        <ion-chip @click="addPicture()" color="secondary" outline>
          <ion-icon :icon="imageIcon" color="secondary"></ion-icon>
          <ion-label>Image</ion-label>
        </ion-chip>
      </ion-col>
      <ion-col size-xs="2" class="ion-hide-md-up">
        <ion-button @click="submit()" fill="outline" v-bind:disabled="!canSubmit" shape="round" size="small">
          <ion-icon :icon="sendIcon"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>


<script lang="ts">
import {
  IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg,
  IonGrid, IonRow, IonCol, IonItem,
} from '@ionic/vue';
import {
  image as imageIcon, readerOutline, paperPlaneOutline as sendIcon, newspaperOutline,
  pencilSharp as editIcon, close as closeIcon,
  eyeOutline,
  earthOutline,
  peopleOutline,
  rocketOutline,
  shieldCheckmarkOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import Selector from "./selector.vue";
import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { Parse, Verb, Visibility } from '../config/Consts';

const VERB_ICONS: Record<string, any>= {};
VERB_ICONS[Verb.Post] = readerOutline;
VERB_ICONS[Verb.Announce] = newspaperOutline;


const VISIBILITY_ICONS: Record<string, any>= {};
VISIBILITY_ICONS[Visibility.Public] = earthOutline;
VISIBILITY_ICONS[Visibility.Members] = peopleOutline;
VISIBILITY_ICONS[Visibility.Mods] = shieldCheckmarkOutline;
VISIBILITY_ICONS[Visibility.Leaders] = rocketOutline;

export default defineComponent({
  name: 'DraftPost',
  emits: ["submitted"],
  data() {
    return {
      showOptions: false,
    }
  },
  setup() {
    const store = useStore();
    return {
      store, VERB_ICONS, VISIBILITY_ICONS,
      teams: computed(() => store.getters["auth/postableTeams"]),
      text: computed(() => store.state.draft.text),
      selectedType: computed(() => store.getters["draft/selectedType"]),
      visibility: computed(() => store.state.draft.visibility),
      images: computed(() => store.state.draft.images),
      updateText: (e: any) => store.commit("draft/setText", e.target.value),
      selectTeam: (t: Parse.Object) => store.commit("draft/setTeam", t),
      setVisibility: (t: Visibility) => store.commit("draft/setVisibility", t),
      selectType: (t: Verb) => store.commit("draft/setType", t),
      selectedTeam: computed(() => store.getters["draft/selectedTeam"]),
      selectedTeamId: computed(() => store.getters["draft/selectedTeamId"]),
      selectableTypes: computed(() => store.getters["draft/selectableTypes"]),
      selectableVisibility: computed(() => store.getters["draft/selectableVisibility"]),
      showTypeSelector: computed(() => store.getters["draft/showTypeSelector"]),
      addPicture() { store.dispatch("draft/addPicture"); },
      submit() { store.dispatch("draft/submit"); },
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      showTeamSelector: computed(() => store.getters["auth/hasManyTeams"]),
      imageIcon, sendIcon, eyeOutline, editIcon,
      selectedIcon: checkmarkOutline, closeIcon,
    }
  },
  components: {
    IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg, IonItem,
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