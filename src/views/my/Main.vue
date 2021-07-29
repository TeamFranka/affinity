<template>
  <ion-page>
    <ion-content>
      <profile-card
        v-if="user"
        can-edit show-qr show-info
        :profile="user"
        :info="user.info"
        @intend-select-avatar="selectNewAvatar"
        @remove-background="removeBackground"
        @intend-select-background="selectNewBackground"
        @intend-edit-title="intendEditName"
        @intend-edit-info="intendEditInfo"
        @intend-edit-social-links="intendEditSocialLinks"
      >
      </profile-card>

      <ion-list>
        <ion-list-header>
          <ion-button size="small" color="dark">
            <ion-back-button default-href="home"></ion-back-button>
          </ion-button>
          <ion-label>
            <i18n-t keypath="my.menu.title"></i18n-t>
          </ion-label>
        </ion-list-header>
        <template v-if="isLoggedIn">
          <ion-item button @click="$router.push({ name: 'Bookmarks' })" data-cy-role="bookmarks">
            <ion-icon :icon="bookmarkIcon" slot="start"/> <i18n-t keypath="menu.bookmarks"/>
          </ion-item>
        </template>
        <template v-if="isLoggedIn">
          <ion-item button @click="$router.push({ name: 'MyTeams' })" data-cy-role="myTeams">
            <ion-icon :icon="teamsIcon" slot="start"/> <i18n-t keypath="menu.myTeams"/>
          </ion-item>
        </template>
        <ion-item
          button
          @click="$router.push({ name: 'Settings' })"
        >
          <ion-icon :icon="generalIcon" slot="start" /> <i18n-t keypath="menu.settings"/>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ProfileCard from "@/components/profile-card.vue";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import { Icons, DefaultIcon } from "@/components/generic/inline-link-list.vue";
import {
  IonContent,
  IonPage,
  modalController,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
  IonBackButton,
  IonButton,
  IonLabel,
 } from "@ionic/vue";
import {
  notificationsOutline as notificationIcon,
  globeOutline as generalIcon,
  bookmarkOutline as bookmarkIcon,
  peopleCircleOutline as teamsIcon  ,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "@/stores/";
import Parse from "parse";
import { takePicture, Photo } from "@/utils/camera";
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
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      generalIcon,
      notificationIcon,
      bookmarkIcon,
      teamsIcon ,
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
    ProfileCard,
    IonPage,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonBackButton,
    IonButton,
    IonLabel,
  },
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0;
}
</style>
