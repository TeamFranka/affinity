<template>
  <ion-page>
    <ion-content>
      <profile-card
        can-edit show-qr show-info show-menu
        :profile="user"
        :segments-value="segmentSelected"
        :segments="segments"
        :info="user.info"
        @segment-selected="segmentSelected = $event"
        @intend-select-avatar="selectNewAvatar"
        @remove-background="removeBackground"
        @intend-select-background="selectNewBackground"
        @intend-edit-title="intendEditName"
        @intend-edit-info="intendEditInfo"
        @intend-edit-social-links="intendEditSocialLinks"
      >
      </profile-card>
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
      <div v-else-if="segmentSelected == 'teams'">
        <div data-cy="my-teams">
          <h2>{{ $t("me.membership.title") }}</h2>
          <router-link
            v-for="t in myTeams"
            :key="t.id"
            :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
          >
            <avatar size="2em" :profile="t" with-name />
          </router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from "@/components/avatar.vue";
import ProfileCard from "@/components/profile-card.vue";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import { Icons, DefaultIcon } from "@/components/generic/inline-link-list.vue";
import {
  IonContent,
  IonPage,
  modalController,
 } from "@ionic/vue";
import { chatbubbles, logoWhatsapp, cloudUploadOutline } from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";
import Parse from "parse";
import { takePicture, Photo } from "@/utils/camera";
import Qrcode from "@/components/qrcode.vue";
import { absoluteUrl } from "@/utils/url";

export default defineComponent({
  name: "Me",
  data() {
    return {
      segmentSelected: "teams"
    }
  },
  setup() {
    const store = useStore();

    return {
      user: computed(() => store.state.auth.user),
      myTeams: computed(() => store.getters["auth/myTeams"]),
      setUserAvatar: (f: Parse.File) => store.dispatch("auth/setAvatar", f),
      setUserBackground: (f: Parse.File) => store.dispatch("auth/setBackground", f),
      setUserData: (d: any) => store.dispatch("auth/setUserData", d),
      chatbubbles,
      logoWhatsapp,
      uploadIcon: cloudUploadOutline,
    };
  },
  computed: {
    socialLinks(): any[] {
      return this.user?.socialLinks || [];
    },
    segments(): any[] {
      return [
        {value: "teams", title: this.$t("profile.tabs.teams")},
     //   {value: "posts", title: this.$t("profile.tabs.posts")},
      ]
    },
    logo(): string | null {
      return this.user && this.user.avatar ? this.user.avatar.url : null;
    },
    fullLink(): string {
      return absoluteUrl(this.$router, {
        name: "ViewUser",
        params: { userId: this.user?.objectId, },
      });
    },
  },
  methods: {
    getSocialIcon(l: string): any {
      return (Icons[l] || { icon: DefaultIcon }).icon;
    },
    selectNewAvatar() {
      takePicture().then((img: Photo) => {
        const file = new Parse.File(
          this.user?.objectId + "_avatar",
          { uri: img.dataUrl },
          "image/" + img.format
        );
        this.setUserAvatar(file);
      });
    },
    async removeBackground() {
      await this.setUserData({ background: null });
    },
    selectNewBackground() {
      takePicture().then((img: Photo) => {
        const file = new Parse.File(
          this.user?.objectId + "_bg",
          { uri: img.dataUrl },
          "image/" + img.format
        );
        this.setUserBackground(file);
      });
    },

    async intendEditName() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.user?.name || "",
          type: "text",
          title: this.$t("user.modal.editName.title"),
          saveLabel: this.$t("user.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setUserData({ name: res.data.value });
      }
    },
    async intendEditInfo() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.user?.info || "",
          type: "richtext",
          isAdminMd: false,
          title: this.$t("team.modal.editInfo.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setUserData({ info: res.data.value });
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
        await this.setUserData({ socialLinks: res.data.items });
      }
    },
  },
  components: {
    Avatar,
    ProfileCard,
    IonPage,
    IonContent,
    Qrcode,
  },
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0;
}
</style>
