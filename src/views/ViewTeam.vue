<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <div class="centralizeTotal" v-if="loading">
          <ion-spinner />
        </div>
        <template v-else>
          <profile-card
            :profile="team"
            :can-edit="!!canEdit"
            :show-qr="true"
            :show-menu="true"
            :segments-value="segmentSelected"
            :segments="segments"
            @segment-selected="segmentSelected = $event"
            @intend-select-avatar="selectNewAvatar"
            @remove-background="removeBackground"
            @intend-select-background="selectBackground"
            @intend-edit-title="intendEditTitle"
            @intend-edit-social-links="intendEditSocialLinks"
          >
          <template v-slot:extra>
            <ion-button
              v-if="canJoin"
              data-cy-role="join"
              size="small"
              shape="round"
              color="primary"
              @click="intentToJoin"
            >
              {{$t("team.actions.join")}}
            </ion-button>
            <ion-button
              v-if="canLeave"
              data-cy-role="leave"
              size="small"
              shape="round"
              fill="outline"
              color="warning"
              @click="intentToLeave"
            >
              {{$t("team.actions.leave")}}
            </ion-button>
          </template>
          <template v-slot:menu>
            <div>
              <inline-link-list showTitle :items="footerLinks">
                <ion-button
                  v-if="canEdit"
                  @click="intendEditFooterLinks"
                  size="small"
                  fill="clear"
                >
                    <ion-icon size="small" :icon="editIcon" />
                </ion-button>
              </inline-link-list>
            </div>
          </template>
          </profile-card>

          <div class="body ion-padding">
            <!-- Div About -->
            <div v-if="segmentSelected == 'about'">
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
                  v-if="subteams"
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
            <div v-if="segmentSelected == 'qrcode'" class="ion-padding">
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
            <div v-if="segmentSelected == 'news'">
              <activity
                v-for="activity in news"
                :activity="activity"
                :key="activity.objectId"
              />
            </div>

            <!-- Div Feed -->
            <div v-if="segmentSelected == 'feed'">
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
import InlineLinkList from "@/components/generic/inline-link-list.vue";
import Avatar from "@/components/avatar.vue";
import { DefaultIcon, Icons } from "@/components/generic/inline-link-list.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import CreateSubTeam from "@/components/settings/create-subteam.vue";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import Activity from "@/components/activity.vue";
import ProfileCard from "@/components/profile-card.vue";
import Qrcode from "@/components/qrcode.vue";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonChip,
  IonSpinner,
  IonButton,
  modalController,
  alertController,
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
import { TeamMembershipAccess } from "@/config/Consts";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";
import Parse from "parse";
import { takePicture, Photo } from "@/utils/camera";
import { Team } from "@/types/team";
import { absoluteUrl } from "@/utils/url";


export default defineComponent({
  name: "Team",
  data() {
    return {
      loading: true,
      segmentSelected: "about",
    };
  },
  setup() {
    const store = useStore();
    return {
      news: computed(()=> store.getters["teams/news/entries"]),
      feed: computed(()=> store.getters["teams/feed/entries"]),
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
    team(): Team {
      const slug: any = this.$route.params.teamSlug;
      return this.store.getters.objectsMap[
        this.store.getters.teamsBySlug[slug]
      ];
    },
    canJoin(): boolean {
      if (this.canLeave) {
        return false
      }
      const access = this.team.membershipAccess || TeamMembershipAccess.Open;
      return access === TeamMembershipAccess.Open;
    },
    canLeave(): boolean {
      return !!this.store.getters["auth/teamPermissions"][this.team.objectId];
    },
    subteams(): Team[] {
      if (!this.team) {
        return [];
      }
      return (this.store.getters["teams/subteams"] || {})[this.team.objectId];
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
    subOf(): Team | null {
      return this.store.getters.objectsMap[this.team.subOf?.id];
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
    logo(): string | undefined {
      return this.team?.avatar?.url
    },
    segments(): any[] {
      return [
        {value: "about", title: this.$t("team.tabs.about")},
        {value: "news", title: this.$t("team.tabs.news")},
        {value: "feed", title: this.$t("team.tabs.feed")},
      ]
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
      this.segmentSelected = ev.detail.value;
    },
    async fetchData() {
      console.log(this.$route);
      const slug: any = this.$route.params.teamSlug;
      console.log("switching to slug", slug);
      this.loading = true;
      if (!slug) { return }
      this.segmentSelected = "about";

      try {
        if (!this.store.getters.teamsBySlug[slug]) {
          await this.store.dispatch("teams/fetch", slug);
        }

        const teamId = this.store.getters.teamsBySlug[slug];
        await this.store.dispatch("teams/setTeam", teamId);

        this.loading = false;
      } catch (error) {
        const toast = await toastController.create({
          message: this.$t("team.error.fetch"),
          position: "top",
          duration: 0,
          buttons: [{ side: "end", role: "cancel", text: "x" }],
        });
        toast.present();
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
    async intendEditSocialLinks() {
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
    async intentToJoin() {
      await this.store.dispatch("auth/joinTeam", this.team.objectId)
    },
    async intentToLeave() {
      const alert = await alertController.create({
        header: this.$t("team.actions.leave.title"),
        message: this.$t("team.actions.leave.message"),
        buttons: [
          {
            text: this.$t("generic.cancel"),
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: this.$t("team.actions.leave.confirm"),
            role: "confirm",
            handler: () => {
              this.store.dispatch("auth/leaveTeam", this.team.objectId)
            },
          },
        ],
      });
      alert.present();
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
        header: this.$t("team.actions.rmBackground.title"),
        message: this.$t("team.actions.rmBackground.message"),
        buttons: [
          {
            text: this.$t("generic.cancel"),
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: this.$t("team.actions.rmBackground.confirm"),
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
    InlineLinkList,
    RenderMd,
    Activity,
    IonPage,
    IonContent,
    IonIcon,
    IonChip,
    IonSpinner,
    IonButton,
    ProfileCard
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
