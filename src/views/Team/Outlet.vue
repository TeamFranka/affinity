<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <div class="centralizeTotal" v-if="loading">
          <ion-spinner />
        </div>
        <template v-else>
          <div class="header" :style="teamStyle">
            <ion-col size-md="2" size-lg="2" size-sm="2" size-xs="3">
              <div class="profile-img">
                <avatar size="7rem" :profile="team" />
                <ion-chip v-if="canEdit" @click="selectNewAvatar()">
                  <ion-icon :icon="uploadIcon"></ion-icon>
                </ion-chip>
              </div>
            </ion-col>

            <ion-col size-xl="8" size-md="8" size-sm="8" size-xs="7" offset="2">
              <h1 data-cy="title">
                {{ team.name }}
                <ion-icon
                  size="small"
                  :icon="editIcon"
                  data-cy-role="editModal"
                  v-if="canEdit"
                  color="light"
                  @click="intendEditTitle"
                />
              </h1>

              <inline-link-list :items="socialLinks" showIcon>
                <div v-if="canEdit" style="display: inline">
                  <ion-icon
                    size="small"
                    :icon="editIcon"
                    @click="intendEditSocialLink"
                    color="light"
                  />
                </div>
              </inline-link-list>

              <div class="extra-actions" v-if="canEdit">
                <ion-chip
                  :title="$t('team.edit.actions.remove_background')"
                  v-if="team.background"
                  @click="removeBackground"
                  outline
                >
                  <ion-icon :icon="imageIcon" />
                  <ion-icon :icon="trashIcon" />
                </ion-chip>

                <ion-chip v-else @click="selectBackground">
                  <ion-icon :icon="imageIcon" />
                  <ion-icon :icon="uploadIcon" />
                </ion-chip>
                <inline-link-list showTitle :items="footerLinks">
                  <li v-if="canEdit">
                    <ion-button
                      @click="intendEditFooterLinks"
                      size="small"
                      fill="clear"
                    >
                      <ion-icon size="small" :icon="editIcon" />
                    </ion-button>
                  </li>
                </inline-link-list>
              </div>
            </ion-col>
          </div>

          <ion-toolbar>
            <ion-segment
              scrollable
              value="about"
              mode="md"
              @ionChange="segmentChanged($event)"
            >
              <ion-segment-button value="qrcode">
                <ion-icon :icon="qrCodeIcon" />
              </ion-segment-button>
              <ion-segment-button value="about">
                <ion-label>{{ $t("team.tabs.about") }}</ion-label>
              </ion-segment-button>
              <ion-segment-button value="news">
                <ion-label>{{ $t("team.tabs.news") }}</ion-label>
              </ion-segment-button>
              <ion-segment-button value="feed">
                <ion-label>{{ $t("team.tabs.feed") }}</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>

          <div class="body ion-padding">
            <!-- Div About -->
            <div v-if="state == 'about'">
              <div data-cy="description">
                <h2 data-cy="title" class="subTitle">
                  {{ team.name }}
                </h2>
                <render-md adminMd :source="team.info" />
                <ion-button
                  data-cy-role="editModal"
                  v-if="canEdit"
                  color="primary"
                  @click="intendEditInfo"
                  size="small"
                  fill="clear"
                >
                  {{ $t("team.description.edit") }}
                </ion-button>
              </div>

              <div>
                <h2 v-if="showSubteamsHeadline">
                  {{ $t("team.subteams.title") }}
                </h2>
                <ul
                  v-if="!!subteams?.length"
                  class="subteams"
                  data-cy="subteams"
                >
                  <li v-for="t in subteams" :key="t.id">
                    <router-link
                      :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
                    >
                      <ion-chip outline>
                        <avatar withName :profile="t" size="1.5em" />
                      </ion-chip>
                    </router-link>
                  </li>
                </ul>
                <ion-chip outline v-if="canEdit">
                  <ion-button
                    data-cy="addSubTeamModal"
                    @click="intendToCreateSubTeam"
                    size="small"
                    fill="clear"
                  >
                    <ion-icon size="small" :icon="addIcon" />
                  </ion-button>
                </ion-chip>
              </div>
              <ion-button
                data-cy-role="edit"
                data-cy-edit-target="styles"
                color="primary"
                @click="intendEditStyles"
                size="small"
                fill="clear"
                style="margin-left: 5%"
                v-if="canEdit"
              >
                {{ $t("team.editCustomStyles.button") }}
              </ion-button>
            </div>

            <!-- Div QRcode -->
            <div v-if="state == 'qrcode'" class="ion-padding">
              <qrcode
                :text="fullLink"
                :logo="logo"
                :height="256"
                :width="256"
              />
              <div v-for="l in socialLinks" :key="l.target">
                <qrcode
                  :text="l.target"
                  :logo="getSocialIcon(l.platform)"
                  class="socialLinks"
                />
              </div>
            </div>

            <!-- Div Feed -->
            <div v-if="state == 'news'">
              <activity
                v-for="activity in news"
                :activity="activity"
                :key="activity.objectId"
              />
            </div>

            <!-- Div Feed -->
            <div v-if="state == 'feed'">
              <activity
                v-for="activity in feed"
                :activity="activity"
                :key="activity.objectId"
              />
            </div>
          </div>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import RenderMd from "@/components/render-md.vue";
import Avatar from "@/components/avatar.vue";
import { DefaultIcon, Icons } from "@/components/generic/inline-link-list.vue";
import InlineLinkList from "@/components/generic/inline-link-list.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import CreateSubTeam from "@/components/settings/create-subteam.vue";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import Activity from "@/components/activity.vue";
import Qrcode from "@/components/qrcode.vue";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonChip,
  IonSpinner,
  IonButton,
  IonToolbar,
  modalController,
  alertController,
  IonSegmentButton,
  IonSegment,
  IonLabel,
  IonCol,
  toastController,
} from "@ionic/vue";

import {
  chatbubbles,
  logoWhatsapp,
  cloudUploadOutline,
  trashOutline as trashIcon,
  imageOutline as imageIcon,
  qrCodeOutline as qrCodeIcon,
  createOutline as editIcon,
  addCircleOutline as addIcon,
} from "ionicons/icons";
import { defineComponent } from "vue";
import { useStore } from "@/stores/";
import Parse from "parse";
import { takePicture, Photo } from "@/utils/camera";
import { Model } from "@/utils/model";
import { absoluteUrl } from "@/utils/url";

const DEFAULT_STYLES = {
  background: "transparent",
  backgroundImage:
    "linear-gradient(to right, var(--ion-color-secondary) 0%, var(--ion-color-primary) 100%)",
};

export default defineComponent({
  name: "Team",
  data() {
    return {
      loading: true,
      state: "about",
    };
  },
  setup() {
    const store = useStore();
    return {
      store,
      chatbubbles,
      logoWhatsapp,
      uploadIcon: cloudUploadOutline,
      editIcon,
      qrCodeIcon,
      imageIcon,
      trashIcon,
      addIcon,
    };
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData",
  },
  computed: {
    team(): Model {
      const slug: any = this.$route.params.teamSlug;
      return this.store.getters.objectsMap[
        this.store.getters.teamsBySlug[slug]
      ];
    },
    feed(): Model[] {
      if (!this.team) return [];
      const teamId = this.team.objectId;
      return this.store.state.teams.activities[teamId].map(
        (id) => this.store.getters["objectsMap"][id]
      );
    },
    news(): Model[] {
      if (!this.team) return [];
      const teamId = this.team.objectId;
      return this.store.state.teams.news[teamId].map(
        (id) => this.store.getters["objectsMap"][id]
      );
    },
    subteams(): Model[] {
      if (!this.team) {
        return [];
      }
      const teamId = this.team.objectId;
      return (this.store.state.teams.subteams[teamId] || []).map(
        (id: string) => this.store.getters["objectsMap"][id]
      );
    },
    info(): string {
      return this.team.info || "";
    },
    socialLinks(): any[] {
      return this.team.socialLinks || [];
    },
    footerLinks(): any[] {
      return this.team.footerLinks || [];
    },
    subOf(): any {
      return this.team.subOf.name || "";
    },
    permissions(): any {
      return (
        this.store.getters["auth/teamPermissions"][this.team.objectId] || {}
      );
    },
    canEdit(): boolean {
      return this.permissions.isAdmin;
    },
    showSubteamsHeadline(): boolean {
      return !!this.subteams?.length || this.canEdit;
    },
    logo(): string | null {
      return this.team && this.team.avatar ? this.team.avatar.url : null;
    },
    teamStyle(): any {
      const customStyles = this.team.customStyles;
      const extraStyles: any = {};
      const backgroundImage = this.team.background;
      if (backgroundImage) {
        extraStyles.backgroundImage = `url(${backgroundImage.url})`;
        extraStyles.backgroundSize = "cover";
      }
      return [DEFAULT_STYLES, customStyles, extraStyles];
    },
    fullLink(): string {
      return absoluteUrl(this.$router, {
        name: "ViewTeam",
        params: { teamSlug: this.team.slug },
      });
    },
  },
  methods: {
    segmentChanged(ev: CustomEvent) {
      this.state = ev.detail.value;
    },
    async fetchData() {
      try {
        this.loading = true;
        this.state = "about";
        const slug: any = this.$route.params.teamSlug;

        if (!this.store.getters.teamsBySlug[slug]) {
          await this.store.dispatch("teams/fetch", slug);
        }
        
        const teamPointer = this.store.getters.objectsMap[
          this.store.getters.teamsBySlug[slug]
        ].toPointer();

        await Promise.all([
          this.store.dispatch("teams/fetchNews", teamPointer),
          this.store.dispatch("teams/fetchActivities", teamPointer),
          this.store.dispatch("teams/fetchSubteams", teamPointer),
        ]);

        this.loading = false;
      } catch (error) {
        const toast = await toastController.create({
          message: this.$t("team.error.fetch"),
          position: "top",
          duration: 0,
          buttons: [{ side: "end", role: "cancel", text: "x" }],
        });
        toast.present();

        console.log(error);
      }
    },
    getSocialIcon(l: string): any {
      return (Icons[l] || { icon: DefaultIcon }).icon;
    },
    async intendToCreateSubTeam() {
      const modal = await modalController.create({
        component: CreateSubTeam,
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        const data = res.data;
        data.subOf = this.team.toPointer();
        const subteam = await this.store.dispatch("teams/createSubteam", data);
        this.$router.push({
          name: "ViewTeam",
          params: { teamSlug: subteam.slug },
        });
      }
    },
    async intendEditTitle() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.name || "",
          type: "text",
          title: this.$t("team.modal.editTitle.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ name: res.data.value });
      }
    },
    async intendEditInfo() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.info || "",
          type: "richtext",
          isAdminMd: true,
          title: this.$t("team.modal.editInfo.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ info: res.data.value });
      }
    },
    async intendEditStyles() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.customStyles,
          type: "textarea",
          help: this.$t("team.modal.editCustomStyles.help"),
          title: this.$t("team.modal.editCustomStyles.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ customStyles: res.data.value });
      }
    },
    async intendEditFooterLinks() {
      const modal = await modalController.create({
        component: EditLinks,
        componentProps: {
          items: Array.from(this.footerLinks),
          withIcons: false,
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ footerLinks: res.data.items });
      }
    },
    async intendEditSocialLink() {
      const modal = await modalController.create({
        component: EditLinks,
        componentProps: {
          items: Array.from(this.socialLinks),
          withIcons: true,
          platforms: Object.keys(Icons).map((x) =>
            Object.assign({}, { key: x }, Icons[x])
          ),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ socialLinks: res.data.items });
      }
    },
    async setSetting(params: any) {
      const model = this.team.prepareSave(params);
      await this.store.dispatch("updateModel", model);
    },
    selectNewAvatar() {
      takePicture().then(async (img: Photo) => {
        const file = new Parse.File(
          this.team.slug + "_avatar",
          { uri: img.dataUrl },
          "image/" + img.format
        );
        await file.save();
        await this.setSetting({ avatar: file });
      });
    },
    async removeBackground() {
      const alert = await alertController.create({
        header: "Hintergrund löschen?",
        message: "Soll der Hintergrund wirklich gelöscht werden?",
        buttons: [
          {
            text: "Abbruch",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Ja, löschen",
            handler: () => {
              this.setSetting({ background: null });
            },
          },
        ],
      });
      return alert.present();
    },
    selectBackground() {
      takePicture().then(async (img: Photo) => {
        const file = new Parse.File(
          this.team.slug + "_background",
          { uri: img.dataUrl },
          "image/" + img.format
        );
        await file.save();
        await this.setSetting({ background: file });
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  components: {
    Avatar,
    Qrcode,
    RenderMd,
    InlineLinkList,
    Activity,
    IonPage,
    IonContent,
    IonIcon,
    IonChip,
    IonSpinner,
    IonButton,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCol,
  },
});
</script>
<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  position: relative;
  display: flex;
  align-content: center;
  align-items: center;
  --menu-color: var(--ion-color-light);
}
ion-toolbar {
  border-bottom: 1px dotted;
  border-top: 1px dotted;
}
.body {
  display: block;
  overflow-y: auto;
}
h1 {
  font-size: 13px;
  text-transform: uppercase;
  margin-left: -5%;
  margin-top: -5%;
}
h2 {
  font-size: 18px;
  font-weight: 400;
}
p {
  font-size: 14px;
  margin: 5%;
  padding-bottom: 5%;
}
h2.subTitle {
  text-transform: uppercase;
}
.profile-img {
  position: relative;
  margin: 2% 5%;
}
.profile-img ion-chip {
  position: absolute;
  bottom: 0;
  left: 80%;
  margin: 0%;
  transform: translateX(-50%);
}
.extra-actions {
  position: absolute;
  bottom: 0;
  right: 0;
}
.submenu {
  padding-top: var(--padding-top);
  padding-bottom: var(--padding-bottom);
  display: flex;
  justify-content: space-around;
}
.submenu a {
  color: var(--ion-color-medium);
  text-decoration: none;
}
.submenu a.router-link-active {
  color: var(--ion-color-primary);
}
ion-chip ion-icon {
  margin: 0;
}
ion-icon {
  cursor: pointer;
}
.subteams {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0.5rem;
}
.subteams li {
  list-style: none;
  padding: 0 1rem 0.5rem 0;
  display: inline-block;
}
.subteams a {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.subteams a > *:not(:first-child) {
  padding-left: 0.2rem;
}
a {
  text-decoration: none;
}
li {
  padding: 0% !important;
}
.socialLinks {
  float: left;
  text-align: center;
  margin: 3%;
}
.centralizeTotal {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>
