<template>
  <ion-page>
    <ion-content>
      <profile-card
        can-edit show-qr show-info
        :profile="user"
        :show-menu="false"
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
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from "@/components/avatar.vue";
import ProfileCard from "@/components/profile-card.vue";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import { Icons } from "@/components/generic/inline-link-list.vue";
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

export default defineComponent({
  name: "Me",
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
  },
  methods: {
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
  },
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0;
}
</style>
