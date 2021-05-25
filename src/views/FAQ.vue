<template>
  <ion-page>
    <ion-content fullscreen>
      <team-selector
        v-if="showTeamSelector"
        @selectTeam="selectTeam($event)"
        :teams="myTeams"
        :selectedTeam="selectedTeam"
      />
      <ion-searchbar
        :disabled="loading || entries.length === 0"
        :value="searchValue"
        data-cy-role="search"
        placholder="Suchen"
        show-cancel-button="focus"
        @ion-change="searchValue = $event.target.value"
      />
      <ion-spinner v-if="loading" />
      <div
        class="ion-padding ion-text-center"
        v-if="!loading && entries.length == 0"
      >
        <p>
          <img
            style="width: 45vw"
            src="../statics/undraw_under_construction.svg"
          />
        </p>
        <ion-note>{{ $t("generic.underConstruction") }}</ion-note>
      </div>
      <div v-if="canCreate" class="ion-text-end">
        <ion-button data-cy="addEntry" @click="intendToCreate">{{
          $t("generic.actions.add")
        }}</ion-button>
      </div>
      <template v-if="!loading && entries.length">
        <faq-entry
          v-for="e in visibleEntries"
          :title="e.title"
          :key="e.objectId"
          :tags="e.tags"
          @tag-selected="searchValue = $event"
        >
          <render-md data-cy-role="desc" admin :source="e.text" />
          <interaction-bar :object="e" link="">
            <template v-if="canCreate" v-slot:extraButtons>
              <ion-button data-cy-role="edit" @click="intendToEdit(e)" fill="clear">{{
                $t("generic.actions.edit")
              }}</ion-button>
            </template>
          </interaction-bar>
        </faq-entry>
      </template>
      <div
        class="ion-padding ion-text-center"
        v-if="visibleEntries.length == 0 && !loading && entries.length != 0"
      >
        <p>
          <img style="width: 45vw" src="../statics/undraw_No_data.svg" />
        </p>
        <ion-note>{{ $t("generic.state.empty") }}</ion-note>
        <p v-if="false">
          <ion-button @click="intendToAskQuestion" fill="outline">{{
            $t("faq.actions.ask")
          }}</ion-button>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import FaqEntry from "../components/faq-entry.vue";
import {
  IonContent,
  IonSearchbar,
  IonPage,
  IonNote,
  IonSpinner,
  IonButton,
  modalController,
  alertController,
} from "@ionic/vue";
import { chatbubbles } from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "../stores/";
import { Parse, FaqEntry as FaqModel } from "../db/models";
import { Model } from "@/utils/model";
import InteractionBar from "../components/interaction-bar.vue";
import EditFaq from "../components/edit-faq.vue";
import RenderMd from "../components/render-md.vue";
import TeamSelector from "@/components/team-selector.vue";


export default defineComponent({
  name: "Faq",
  setup() {
    const store = useStore();
    return {
      store,
      chatbubbles,
      loggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      loading: computed(() => store.getters["faq/loading"]),
      teamId: computed(() => store.getters["defaultTeamId"]),
      team: computed(() => store.getters["defaultTeam"]),
      myTeams: computed(() => store.getters["auth/myTeams"]),
      selectedTeam: computed(()=> store.getters["faq/selectedTeam"]),
      selectTeam: async (name: string) => {
        await store.dispatch("faq/selectTeam", name === "ALL" ? null : name);
      },
      refresh() {
        store.dispatch("faq/refresh");
      },
      entries: computed(() => store.getters["faq/entries"]),
    };
  },
  data() {
    return {
      searchValue: "",
    };
  },
  computed: {
    showTeamSelector(): boolean {
      return this.loggedIn && this.myTeams.length > 1
    },
    canCreateInTeams(): Model[] {
      return this.myTeams.filter(({objectId}: Model) => this.store.getters["auth/teamPermissions"][objectId]?.canCreateFaqEntry)
    },
    canCreate(): boolean {
      if (!this.loggedIn) {
        return false
      }
      if (this.selectedTeam){
        return this.store.getters["auth/teamPermissions"][this.selectedTeam]?.canCreateFaqEntry
      }
      return this.canCreateInTeams.length > 0
    },
    visibleEntries(): any[] {
      if (!this.searchValue) {
        return this.entries;
      }

      const keys = this.searchValue.split(" ");

      return this.entries.filter((e: Model) => {
        const allText = (e.tags || []).join(" ").concat(e.title).concat(e.text);
        for (let i = 0; i < keys.length; i++) {
          if (allText.indexOf(keys[i]) === -1) {
            return false;
          }
        }
        return true;
      });
    },
  },
  methods: {
    async intendToCreate() {
      await this.editModal(
        new FaqModel({
          team: (this.selectedTeam || this.team).toPointer(),
        }),
        "Erstellen"
      );
    },
    async intendToEdit(entry: Model) {
      await this.editModal(entry, "Save");
    },
    async editModal(entry: Model, saveLabel: string): Promise<any> {
      const modal = await modalController.create({
        component: EditFaq,
        componentProps: {
          teams: this.canCreateInTeams,
          faq: entry.toJSON(),
          saveLabel,
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        this.loading = true;
        await entry.save(res.data);
        this.loading = false;
      }
      return null;
    },
    async intendToAskQuestion() {
      const teamId = this.teamId;

      const alert = await alertController.create({
        header: "Frage an das Team stellen!",
        message: "Welche Frage hast du?",
        inputs: [
          {
            name: "message",
            type: "textarea",
            value: this.searchValue,
            placeholder: "Deine Frage ....",
          },
        ],
        buttons: [
          {
            text: "Abbruch",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Schicken",
            handler: async (data) => {
              const { message } = data;
              if (!message) {
                return;
              }
              await Parse.Cloud.run("newPublicInboxConversation", {
                teamId,
                message,
              });
              await this.store.dispatch("inbox/refresh");
              this.$router.push("/inbox");
            },
          },
        ],
      });
      return alert.present();
    },
  },
  mounted() {
    if (!this.loading && this.entries.length === 0) {
      this.refresh();
    }
  },
  components: {
    IonPage,
    IonNote,
    IonContent,
    IonSearchbar,
    IonSpinner,
    IonButton,
    FaqEntry,
    InteractionBar,
    RenderMd,
    TeamSelector,
  },
});
</script>
