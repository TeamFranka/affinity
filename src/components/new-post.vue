<template>
  <ion-grid class="new-post">
    <ion-row v-if="showTeamSelector">
      <ion-col size="2">
        Post
      </ion-Col>
      <ion-col size="5" v-if="showTeamSelector">
        to
        <ion-select  v-model="team" interface="popover" @change="selectTeam($event)" placeholder="select Team">
          <ion-select-option v-for="team in teams"  :key="team.id" :value="model.team.id">
            <avatar withName :profile="team" />
          </ion-select-option>
        </ion-select>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size="11">
        <ion-textarea auto-grow=true :value="text" @change="updateText" placeholder="What do you want to share?" />
      </ion-col>
      <ion-col size="1">
        <ion-button @click="submit()" fill="outline" v-bind:disabled="!canSubmit" shape="round" size="small">
          <ion-icon slot="icon-only" :icon="sendIcon"></ion-icon>
        </ion-button>
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
  IonSelect, IonSelectOption, IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { image as imageIcon, paperPlaneOutline as sendIcon } from 'ionicons/icons';
import Avatar from "./avatar.vue";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import Parse from 'parse';

export default defineComponent({
  name: 'DraftPost',
  emits: ["submitted"],
  setup() {
    const store = useStore();
    return {
      teams: computed(() => store.getters["auth/postableTeams"]),
      text: computed(() => store.state.draft.text),
      images: computed(() => {
        const i = store.state.draft.images;
        console.log("images", i);
        return i
      }),
      updateText: (e: any) => store.commit("draft/setText", e.target.value),
      selectTeam: (t: Parse.Object) => store.commit("draft/setTeam", t),
      addPicture() {
        store.dispatch("draft/addPicture");
      },
      submit() {
        store.dispatch("draft/submit");
      },
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      showTeamSelector: computed(() => store.getters["auth/postableTeams"].length > 1),
      imageIcon, sendIcon
    }
  },
  components: {
    IonSelect, IonSelectOption, IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg,
    IonGrid, IonRow, IonCol,
    Avatar
  }
});
</script>
<style scoped>
.new-post {
  max-width: 1080px;
  margin: 0 auto;
}
</style>