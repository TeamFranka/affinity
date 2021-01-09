<template>
  <ion-grid class="new-post">
    <ion-row>
      <ion-col size-md="11" size-xs="10">
        <ion-textarea auto-grow=true :value="text" @change="updateText" placeholder="What do you want to share?" />
        <p @click="showOptions = true" v-if="!showOptions">{{visibility}} {{selectedType}} to <avatar size="1.5em" :profile="selectedTeam" withName /><ion-button size="small" fill="clear"><ion-icon :icon="editIcon"/></ion-button></p>
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
      <ion-col size-md="6" v-for="(o, index) in objects" v-bind:key="o._localId">
        <div v-if="o.className == 'Picture'">
          <ion-img :src="o.get('img').dataUrl" />
          <ion-input placeholder="description"
            @ionChanged="updateObject({index, data: {description: $event.target.value}})"
            :value="o.get('description')"
          />
        </div>
        <div v-else-if="o.className == 'Poll'">
          <poll :poll="o">
            <template v-slot:extraButtons>
              <ion-button @click="editPoll(index)" size="small" fill="clear" color="dark">
                <ion-icon :icon="editIcon"/>
              </ion-button>
              <ion-button @click="removeObject(index)" size="small" fill="clear" color="dark">
                <ion-icon :icon="deleteIcon"/>
              </ion-button>
            </template>
          </poll>
        </div>
        <div v-else-if="o.className == 'Link'">
          <ion-spinner v-if="o.get('loading')" />
          <span v-if="o.get('siteName')">{{o.get('siteName')}}</span>
          <a :href="o.get('url')" v-if="o.get('title')">{{o.get('title')}}</a>
          <a :href="o.get('url')" v-else>{{o.get('url')}}</a>
          <ion-img v-if="o.get('previewImage')" :src="o.get('previewImage').url()" />
          <p>{{o.get('description')}}</p>
        </div>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col size-sm="12" size-xs="10">
        <ion-chip v-if="canCreatePicture" @click="addPicture()" color="secondary" outline>
          <ion-icon :icon="imageIcon" color="secondary"></ion-icon>
          <ion-label>Image</ion-label>
        </ion-chip>
        <ion-chip v-if="canCreatePoll" @click="addPoll()" color="secondary" outline>
          <ion-icon :icon="listIcon" color="secondary"></ion-icon>
          <ion-label>Umfrage  </ion-label>
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
  IonGrid, IonRow, IonCol, IonItem, modalController, IonSpinner,
} from '@ionic/vue';
import {
  image as imageIcon, readerOutline, paperPlaneOutline as sendIcon, newspaperOutline,
  createOutline  as editIcon, close as closeIcon,
  listOutline as listIcon,
  trashOutline as deleteIcon,
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
import EditPoll from "./edit-poll.vue";
import Poll from "./poll.vue";
import { useStore } from '../stores/';
import { Parse, Verb, Visibility } from '../config/Consts';
import { Poll as PollModel } from '../db/models';

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
      objects: computed(() => store.getters["draft/objects"]),
      updateText: (e: any) => store.dispatch("draft/updateText", e.target.value),
      selectTeam: (t: Parse.Object) => store.commit("draft/setTeam", t),
      setVisibility: (t: Visibility) => store.commit("draft/setVisibility", t),
      selectType: (t: Verb) => store.commit("draft/setType", t),
      selectedTeam: computed(() => store.getters["draft/selectedTeam"]),
      selectedTeamId: computed(() => store.getters["draft/selectedTeamId"]),
      selectableTypes: computed(() => store.getters["draft/selectableTypes"]),
      selectableVisibility: computed(() => store.getters["draft/selectableVisibility"]),
      showTypeSelector: computed(() => store.getters["draft/showTypeSelector"]),
      canCreatePicture: computed(()=> store.getters["draft/selectedTeamPerms"].canCreatePicture ),
      addPicture() { store.dispatch("draft/addPicture"); },
      canCreatePoll: computed(()=> store.getters["draft/selectedTeamPerms"].canCreatePoll ),
      submit() { store.dispatch("draft/submit"); },
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      removeObject: (idx: number) => store.commit("draft/removeObject", idx),
      updateObject: (e: any) => store.dispatch("draft/updateObject", e),
      showTeamSelector: computed(() => store.getters["auth/hasManyTeams"]),
      imageIcon, sendIcon, eyeOutline, editIcon, listIcon,
      selectedIcon: checkmarkOutline, closeIcon, deleteIcon,
    }
  },
  components: {
    IonTextarea, IonChip, IonIcon, IonLabel, IonButton, IonInput, IonImg, IonItem,
    IonGrid, IonRow, IonCol, IonSpinner,  Selector, Avatar, Poll,
  },
  methods: {
    async addPoll() {
      const newPoll = new PollModel({options:[{title: 'Option 1'}, {title: 'Option 2'}, {title: 'Option 3'}]});
      const modal = await modalController
        .create({
          component: EditPoll,
          componentProps: {
            poll: newPoll,
            saveLabel: "Erstellen",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        this.store.commit("draft/addObject", new PollModel(res.data));
      }
    },

    async editPoll(index: number) {
      const poll = this.objects[index];
      const modal = await modalController
        .create({
          component: EditPoll,
          componentProps: {
            poll: poll,
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        this.store.commit("draft/updatePoll", {index, data: res.data});
      }
    },
  }
});
</script>
<style scoped>
.new-post {
  max-width: 1080px;
  margin: 0 auto;
}
</style>