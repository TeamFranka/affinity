<template>
  <form @submit="submit" >
    <ion-grid class="new-post" data-cy="newPost">
      <ion-row>
         <ion-col>
          <rich-editor
            ref="editor"
            :enabledActions="richActions"
            :startText="text"
            @change="updateText"
          ></rich-editor>
          <p
            @click="showOptions = true"
            v-if="canChangeVisiblity && !showOptions"
            data-cy-role="editSettings"
          >
            {{ $t(`newPost.visibilities.${visibility}`) }}
            <span data-cy-role="postType" :data-cy-value="selectedType" v-if="showTypeSelector">
              {{ $t(`post.types.${selectedType}`) }}
            </span>
            <span v-if="showTeamSelector"
              >to <avatar size="1.5em" :profile="selectedTeam" withName />
            </span>
            <span v-if="showColorSelector">
              <span :style="`background: ${backgroundColor}`" class="color-indicator" />
              <span :style="`background: ${buttonColor}`" class="color-indicator" />
            </span>
            <ion-button size="small" fill="clear"
              ><ion-icon :icon="editIcon"
            /></ion-button>
          </p>
        </ion-col>
        <ion-col size-xs="2" size-md="1" v-if="!hideSend">
          <ion-button
            data-cy="submitPost"
            type="submit"
            data-cy-role="submit"
            fill="outline"
            v-bind:disabled="!canSubmit"
            shape="round"
            size="small">

            <ion-icon :icon="sendIcon"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row v-if="showOptions">
        <ion-col size-md="auto" size-xs="12" v-if="showTeamSelector">
          <team-selector
            :teams="teams"
            currentShowName
            @selectTeam="selectTeam($event)"
            :selectedTeam="selectedTeam"
          />
        </ion-col>
        <ion-col size-md="auto" size-xs="12" v-if="canChangeVisiblity">
          <selector
            @select="setVisibility($event)"
            popoverTitle="Visibility"
            :items="selectableVisibility"
          >
            <template #label>
              <ion-label
                class="sc-ion-label-md-h sc-ion-label-md-s ion-color ion-color-dark md hydrated"
                style="padding-right: 0.5em;"
              >
                <ion-icon :icon="eyeOutline" /> {{ $t("newPost.label.visibility") }}: </ion-label>
            </template>
            <template #current>
              <ion-label>
                <ion-icon :icon="VISIBILITY_ICONS[visibility]"></ion-icon>
                {{ $t(`newPost.visibilities.${visibility}`) }}
              </ion-label>
            </template>
            <template #item="sProps">
              <ion-item
                @click="sProps.select(sProps.item)"
                :key="sProps.item"
                button
              >
                <ion-icon
                  slot="start"
                  :icon="VISIBILITY_ICONS[sProps.item]"
                ></ion-icon>
                {{ sProps.item }}
                <ion-icon
                  v-if="sProps.item == visibility"
                  slot="end"
                  :icon="selectedIcon"
                />
              </ion-item>
            </template>
          </selector>
        </ion-col>
        <ion-col size-md="auto" size-xs="12" v-if="showTypeSelector" data-cy-role="selectType">
          <selector
            label="Type"
            popoverTitle="Post Type"
            @select="selectType($event)"
            :items="selectableTypes"
          >
            <template #current>
              <ion-label>
                <ion-icon :icon="VERB_ICONS[selectedType]"></ion-icon>
              {{ $t(`post.types.${selectedType}`) }}
              </ion-label>
            </template>
            <template #item="sProps">
              <ion-item
                @click="sProps.select(sProps.item)"
                :key="sProps.item"
                :data-cy-select="sProps.item"
                button
              >
                <ion-icon slot="start" :icon="VERB_ICONS[sProps.item]" />
                  {{ $t(`post.types.${sProps.item}`) }}
                <ion-icon
                  v-if="sProps.item == selectedType"
                  slot="end"
                  :icon="selectedIcon"
                />
              </ion-item>
            </template>
          </selector>
        </ion-col>
        <ion-col size-md="auto" size-xs="12" v-if="showColorSelector" data-cy-role="selectColors">
          <selector
            popoverTitle="Background"
            @select="setExtraStyle({background: $event})"
            :items="SELECTABLE_BACKGROUND_STYLES"
          >
            <template #current>
              <ion-label data-cy-role="selectBackgroundColor">
                <span :style="`background: ${backgroundColor}`" class="color-indicator" />
              </ion-label>
            </template>
            <template #item="sProps">
              <span
                @click="sProps.select(sProps.item)"
                :key="sProps.item"
                :data-cy-select="sProps.item"
                :style="`background: ${sProps.item}`"
                class="color-indicator"
              />
            </template>
          </selector>

          <selector
            popoverTitle="Button Color"
            @select="setExtraStyle({buttonColor: $event})"
            :items="SELECTABLE_BUTTON_STYLES"
          >
            <template #current>
              <ion-label data-cy-role="selectButtonColor">
                <span :style="`background: ${buttonColor}`" class="color-indicator" />
              </ion-label>
            </template>
            <template #item="sProps">
              <span
                @click="sProps.select(sProps.item)"
                :key="sProps.item"
                :data-cy-select="sProps.item"
                :style="`background: ${sProps.item}`"
                class="color-indicator"
              />
            </template>
          </selector>
        </ion-col>
        <ion-button
          :style="{ position: 'absolute', right: '1em', 'z-index': 1 }"
          size="small"
          fill="clear"
          @click="showOptions = false"
          data-cy-role="closeSettings"
        >
          <ion-icon :icon="closeIcon" />
        </ion-button>
      </ion-row>
      <ion-row>
        <ion-col
          size-xs="6"
          size-lg="4"
          v-for="(o, index) in objects"
          v-bind:key="o._localId"
        >
          <ion-card>
            <div class="ion-text-end">
              <ion-button
                v-if="index != 0"
                @click="moveLeft(index)"
                size="small"
                fill="clear"
                color="medium"
              >
                <ion-icon :icon="leftIcon" />
              </ion-button>
              <ion-button
                v-if="index + 1 !== objects.length"
                @click="moveRight(index)"
                size="small"
                fill="clear"
                color="medium"
              >
                <ion-icon :icon="rightIcon" />
              </ion-button>
              <ion-button
                @click="removeObject(index)"
                size="small"
                fill="clear"
                color="medium"
              >
                <ion-icon :icon="deleteIcon" />
              </ion-button>
            </div>
            <ion-card-content>
              <div v-if="o.className == 'Picture'" data-cy-obj="picture">
                <!-- FIXME: this renders incorrectly while saving... -->
                <ion-img v-if="o.img" :src="o.img.dataUrl" />
                <ion-input
                  :placeholder="$t('newPost.placeholder.description')"
                  @ion-change="
                    updateObject({
                      index,
                      data: { description: $event.target.value },
                    })
                  "
                  :value="o.description"
                />
              </div>
              <div v-else-if="o.className == 'Poll'" data-cy-obj="poll">
                <poll :poll="o">
                  <template v-slot:extraButtons>
                    <ion-button
                      @click="editPoll(index)"
                      size="small"
                      fill="clear"
                      color="dark"
                    >
                      <ion-icon :icon="editIcon" />
                    </ion-button>
                  </template>
                </poll>
              </div>
              <div v-else-if="o.className == 'Link'" data-cy-obj="link">
                <div v-if="o.loading">
                  <ion-spinner /><ion-icon :icon="linkIcon" /><a
                    :href="o.url"
                    >{{ o.url }}</a
                  >
                </div>
                <div v-else>
                  <span class="text-muted" v-if="o.siteName">{{
                    o.siteName
                  }}</span>
                  <div style="display: flex; align-items: center">
                    <ion-icon :icon="linkIcon" />
                    <ion-input
                      @ion-change="
                        updateObject({
                          index,
                          data: { title: $event.target.value },
                        })
                      "
                      :value="o.title"
                      required
                      name="title"
                      :placeholder="o.url"
                    />
                  </div>
                  <a :href="o.url">{{ o.url }}</a>
                  <ion-img v-if="o.previewImage" :src="o.previewImage._url" />
                  <ion-textarea
                    @ion-change="
                      updateObject({
                        index,
                        data: { previewText: $event.target.value },
                      })
                    "
                    :value="o.previewText"
                    :placeholder="$t('newPost.placeholder.previewText')"
                  />
                  <ion-button
                    v-if="canCreateDocument"
                    @click="convertLinkToDocument(index)"
                    size="small"
                    fill="clear"
                    >{{ $t("newPost.actions.convertToDoc") }}</ion-button
                  >
                </div>
              </div>
              <div v-else-if="o.className == 'Document'" data-cy-obj="document">
                <div v-if="o.loading">
                  <ion-spinner /><ion-icon :icon="documentIcon" /><a
                    :href="o.url"
                    >{{ o.url }}</a
                  >
                </div>
                <div v-else>
                  <span class="text-muted" v-if="o.siteName">{{
                    o.siteName
                  }}</span>
                  <div style="display: flex; align-items: center">
                    <ion-icon :icon="documentIcon" />
                    <ion-input
                      @ion-change="
                        updateObject({
                          index,
                          data: { title: $event.target.value },
                        })
                      "
                      :value="o.title"
                      name="title"
                      required
                      :placeholder="o.url"
                    />
                  </div>
                  <ion-textarea
                    @ion-change="
                      updateObject({
                        index,
                        data: { description: $event.target.value },
                      })
                    "
                    :value="o.description"
                    :placeholder="$t('newPost.placeholder.description')"
                  />
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <input
            type="file"
            ref="fileSelector"
            style="display: none"
            v-if="canCreateDocument"
            multiple
            @change="uploadDocs($event.target.files)"
          />
          <ion-chip
            v-if="canCreatePicture"
            @click="addPicture()"
            color="secondary"
            outline
          >
            <ion-icon :icon="imageIcon" color="secondary"></ion-icon>
            <ion-label>{{ $t("newPost.actions.add.image") }}</ion-label>
          </ion-chip>
          <ion-chip
            v-if="canCreatePoll"
            data-cy="addPoll"
            @click="addPoll()"
            color="secondary"
            outline
          >
            <ion-icon :icon="listIcon" color="secondary"></ion-icon>
            <ion-label>{{ $t("newPost.actions.add.poll") }} </ion-label>
          </ion-chip>
          <ion-chip
            v-if="canCreateLink"
            data-cy="addLink"
            @click="addLink('addLink')"
            color="secondary"
            outline
          >
            <ion-icon :icon="linkIcon" color="secondary"></ion-icon>
            <ion-label>{{ $t("newPost.actions.add.link") }}</ion-label>
          </ion-chip>
          <ion-chip
            v-if="canCreateDocument"
            @click="addDocument()"
            color="secondary"
            outline
          >
            <ion-icon :icon="documentIcon" color="secondary"></ion-icon>
            <ion-label>{{ $t("newPost.actions.add.document") }}</ion-label>
          </ion-chip>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</template>

<script lang="ts">
import {
  IonTextarea,
  IonChip,
  IonIcon,
  IonLabel,
  IonButton,
  IonInput,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  modalController,
  IonSpinner,
  IonCard,
  IonCardContent,
  alertController,
  actionSheetController,
} from "@ionic/vue";
import {
  image as imageIcon,
  readerOutline,
  paperPlaneOutline as sendIcon,
  newspaperOutline,
  createOutline as editIcon,
  close as closeIcon,
  listOutline as listIcon,
  trashOutline as deleteIcon,
  chevronBackSharp as leftIcon,
  chevronForwardSharp as rightIcon,
  linkOutline as linkIcon,
  documentOutline as documentIcon,
  cloudUploadOutline as uploadIcon,
  eyeOutline,
  earthOutline,
  peopleOutline,
  rocketOutline,
  shieldCheckmarkOutline,
  checkmarkOutline,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import TeamSelector from "@/components/team-selector.vue";
import Avatar from "./avatar.vue";
import EditPoll from "./edit-poll.vue";
import Poll from "./poll.vue";
import { useStore } from "../stores/";
import { Verb, Visibility } from "../config/Consts";
import { AllActions, DefaultActions } from "./rich-editor.vue";
import RichEditor from "./rich-editor.vue";
import { Model, CreateModel } from "@/types/model";

const VERB_ICONS: Record<string, any> = {};
VERB_ICONS[Verb.Post] = readerOutline;
VERB_ICONS[Verb.Announce] = newspaperOutline;

const VISIBILITY_ICONS: Record<string, any> = {};
VISIBILITY_ICONS[Visibility.Public] = earthOutline;
VISIBILITY_ICONS[Visibility.Members] = peopleOutline;
VISIBILITY_ICONS[Visibility.Mods] = shieldCheckmarkOutline;
VISIBILITY_ICONS[Visibility.Leaders] = rocketOutline;

const SELECTABLE_BACKGROUND_STYLES = [
  "var(--ion-color-primary)",
  "var(--ion-color-secondary)",
  "var(--ion-color-tertiary)",
  "linear-gradient(to top right, var(--ion-color-primary), var(--ion-color-secondary))",
  "linear-gradient(to top right, var(--ion-color-secondary), var(--ion-color-tertiary))",
  "linear-gradient(to top right, var(--ion-color-primary), var(--ion-color-tertiary))",
];

const SELECTABLE_BUTTON_STYLES: string[] = [
  "var(--ion-color-primary)",
  "var(--ion-color-secondary)",
  "var(--ion-color-tertiary)",
  "#000000",
  "#FFFFFF",
];

export default defineComponent({
  name: "DraftPost",
  emits: ["submitted"],
  props: {
    teams: {
      type: Array,
      required: true,
    },
     hideSend: {
      type: Boolean,
      required: true
    },
    canChangeVisiblity: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      showOptions: false,
    };
  },
  setup() {
    const store = useStore();
    return {
      store,
      VERB_ICONS,
      VISIBILITY_ICONS,
      SELECTABLE_BACKGROUND_STYLES,
      SELECTABLE_BUTTON_STYLES,
      // generic
      text: computed(() => store.state.draft.text),
      selectedType: computed(() => store.getters["draft/selectedType"]),
      richActions: computed(() =>
        store.getters["draft/selectedType"] == "announce"
          ? AllActions
          : DefaultActions
      ),
      visibility: computed(() => store.state.draft.visibility),

      updateText: (value: string) => store.dispatch("draft/updateText", value),
      selectTeam: (t: Model) => store.commit("draft/setTeam", t),
      setVisibility: (t: Visibility) => store.commit("draft/setVisibility", t),
      selectType: (t: Verb) => store.commit("draft/setType", t),
      selectedTeam: computed(() => store.getters["draft/selectedTeam"]),
      selectedTeamId: computed(() => store.getters["draft/selectedTeamId"]),
      showTypeSelector: computed(() => store.getters["draft/showTypeSelector"]),
      showColorSelector: computed(() => store.getters["draft/selectedType"] == "announce" ),

      backgroundColor: computed(() => (store.getters["draft/extraStyles"].background || "var(--ion-color-primary)")),
      buttonColor: computed(() => (store.getters["draft/extraStyles"].buttonColor || "var(--ion-color-medium)")),
      setExtraStyle: (updates: any) => {
        store.commit("draft/setExtraStyle", updates);
      },
      // permissions
      selectableTypes: computed(() => store.getters["draft/selectableTypes"]),
      selectableVisibility: computed(
        () => store.getters["draft/selectableVisibility"]
      ),
      canCreatePicture: computed(
        () => store.getters["draft/selectedTeamPerms"].canCreatePicture
      ),
      canCreatePoll: computed(
        () => store.getters["draft/selectedTeamPerms"].canCreatePoll
      ),
      canCreateLink: computed(
        () => store.getters["draft/selectedTeamPerms"].canCreateLink
      ),
      canCreateDocument: computed(
        () => store.getters["draft/selectedTeamPerms"].canCreateDocument
      ),

      // objects
      objects: computed(() => store.getters["draft/objects"]),
      moveLeft: (i: number) => store.dispatch("draft/swapObjects", i - 1),
      moveRight: (i: number) => store.dispatch("draft/swapObjects", i),
      removeObject: (idx: number) => store.commit("draft/removeObject", idx),
      updateObject: (e: any) => store.commit("draft/updateObject", e),

      // specifics
      addPicture() {
        store.dispatch("draft/addPicture");
      },
      convertLinkToDocument: (index: number) =>
        store.dispatch("draft/convertLinkToDocument", index),
      uploadDocs: (files: FileList) => {
        for (const f of files) {
          store.dispatch("draft/addDocumentFile", f);
        }
      },
      // submission
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      // icons
      imageIcon,
      sendIcon,
      eyeOutline,
      editIcon,
      listIcon,
      leftIcon,
      rightIcon,
      selectedIcon: checkmarkOutline,
      closeIcon,
      deleteIcon,
      linkIcon,
      documentIcon,
    };
  },
  computed: {
    showTeamSelector(): boolean {
      return this.teams.length > 1;
    },
  },
  components: {
    IonTextarea,
    IonChip,
    IonIcon,
    IonLabel,
    IonButton,
    IonInput,
    IonImg,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    TeamSelector,
    Avatar,
    Poll,
    IonCard,
    IonCardContent,
    RichEditor,
  },
  methods: {
    async submit(e: Event) {
      e.preventDefault();
      await this.store.dispatch("draft/submit");
      console.log(this.$refs.editor);
      (this.$refs.editor as any).clear();
    },
    async addPoll() {
      const newPoll = {
        options: [
          { title: "Option 1" },
          { title: "Option 2" },
          { title: "Option 3" },
        ],
      };
      const modal = await modalController.create({
        component: EditPoll,
        componentProps: {
          poll: newPoll,
          saveLabel: "Erstellen",
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        this.store.commit("draft/addObject", new CreateModel("Poll", res.data));
      }
    },

    async addDocument() {
      const actionSheet = await actionSheetController.create({
        header: "Document",
        buttons: [
          {
            text: "Upload",
            icon: uploadIcon,
            handler: () => {
              const e: any = this.$refs.fileSelector;
              e.click();
            },
          },
          {
            text: "Link",
            icon: linkIcon,
            handler: () => {
              this.addLink("addDocumentLink");
            },
          },
        ],
      });
      return actionSheet.present();
    },
    async addLink(target: string) {
      const alert = await alertController.create({
        header: this.$t("newPost.addLink.header"),
        message: this.$t("newPost.addLink.message"),
        inputs: [
          {
            name: "link",
            type: "url",
            placeholder: "https://...",
          },
        ],
        buttons: [
          {
            text: this.$t("newPost.addLink.buttons.cancel"),
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: this.$t("newPost.addLink.buttons.add"),
            handler: async (data) => {
              const { link } = data;
              this.store.dispatch(`draft/${target}`, link);
            },
          },
        ],
      });
      return alert.present();
    },
    async editPoll(index: number) {
      const poll = this.objects[index];
      const modal = await modalController.create({
        component: EditPoll,
        componentProps: {
          poll: poll,
          saveLabel: this.$t("generic.buttons.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        this.store.commit("draft/updatePoll", { index, data: res.data });
      }
    },
     closeModal() {
        modalController.dismiss();
    },
  }
});
</script>
<style scoped>
.new-post {
  max-width: 1080px;
  margin: 0 auto;
}
.container{
  border:1px solid grey;
  height:300px;
}
.wrapper-container{
    margin: 0 auto;
    display: flex;
    flex-direction: column-reverse;
}
ion-back-button{
  display: block;
}
.color-indicator {
  display: inline-block;
  height: 0.75rem;
  width: 0.75rem;
  border: 1px solid var(--ion-color-dark);
  margin-left: 0.2rem;
  border-radius: 0.2rem;
}
.popover-viewport .color-indicator {
  height: 2rem;
  width: 2rem;
}
</style>
