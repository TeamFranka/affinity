<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <ion-spinner v-if="loading"/>
        <template v-else>
          <div class="header" :style="teamStyle">
            <div class="profile-img ion-padding">
              <avatar size="10rem" :profile="settings" />
              <ion-chip v-if="canEdit" @click="selectNewAvatar()">
                <ion-icon :icon="uploadIcon"></ion-icon>
              </ion-chip>
            </div>
            <div class="ion-padding">
              <h1>{{team.get('name')}}</h1>
              <ul class="social-icons">
                <li v-for="l in socialLinks" :key="l.target">
                  <a :href="l.target" target="_blank">
                    <ion-icon :icon="getSocialIcon(l.platform)" />
                  </a>
                </li>
                <li v-if="canEdit">
                  <ion-button @click="intendEditSocialLink" color="light" size="small" fill="clear">
                    <ion-icon size="small" :icon="editIcon" />
                  </ion-button>
                </li>
              </ul>
              <render-md adminMd :source="info" />
              <ion-button v-if="canEdit" color="light" @click="intendEditInfo" size="small" fill="clear">
                Edit Text
              </ion-button>
            </div>
            <div class="extra-actions" v-if="canEdit">
              <ion-chip title="remove background" v-if="settings.get('background')" @click="removeBackground">
                <ion-icon :icon="imageIcon" />
                <ion-icon  :icon="trashIcon" />
              </ion-chip>
              <ion-chip v-else @click="selectBackground" title="upload background">
                <ion-icon :icon="imageIcon" />
                <ion-icon :icon="uploadIcon" />
              </ion-chip>
              <ion-button color="light" @click="intendEditStyles" size="small" fill="clear">
                Edit Custom Styles
              </ion-button>
            </div>
          </div>
          <ion-toolbar class="ion-padding-end">
            <ion-button size="small" @click="showQr = !showQr" fill="clear">
              <ion-icon size="small" :icon="qrCodeIcon" />
            </ion-button>
            <div slot="end">
              End Menu
            </div>
          </ion-toolbar>
          <div v-if="showQr">
            <ul class="social-icons">
              <li>
                <qrcode :text="fullLink" :logo="logo" />
              </li>
              <li v-for="l in socialLinks" :key="l.target">
                <qrcode :text="l.target" :logo="getSocialIcon(l.platform)" />
              </li>
            </ul>
          </div>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import RenderMd from '../components/render-md.vue';
import Avatar from '../components/avatar.vue';
import EditSocialLinks from '../components/settings/edit-social-links.vue';
import GenericEditorModal from '../components/settings/generic-editor-modal.vue';
import Qrcode from '../components/qrcode.vue';
import {
  IonContent, IonPage,  IonIcon, IonChip, IonSpinner, IonButton,
  modalController, alertController, IonToolbar,
} from '@ionic/vue';
import {
  chatbubbles, logoWhatsapp, cloudUploadOutline, logoTwitter, logoSoundcloud,
  logoGithub, logoGitlab, logoLinkedin, logoAmazon, logoFacebook, logoStackoverflow,
  logoMedium, logoPaypal, logoReddit, logoSkype, logoSnapchat, logoTiktok, logoYoutube,
  logoVimeo, logoXing,
  logoInstagram, globeOutline,
  trashOutline as trashIcon,
  imageOutline as imageIcon,
  qrCodeOutline as qrCodeIcon,
  createOutline as editIcon,
} from 'ionicons/icons';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../stores/';
import { useRoute } from 'vue-router';
import Parse from 'parse';
import { takePicture, CameraPhoto } from '../utils/camera';

const DEFAULT_ICON = globeOutline;
const ICONS: Record<string, any> = {
  'whatsApp': { icon: logoWhatsapp, title: "WhatsApp", prefix: "whatsapp://" },
  'skype': { icon: logoSkype, title: "skype", prefix: "skype://" },
  'snapchat': { icon: logoSnapchat, title: "snapchat", prefix: "snapchat://" },
  'amazon': { icon: logoAmazon, title: "amazon", prefix: "https://amazon.com" },
  'youtube': { icon: logoYoutube, title: "youtube", prefix: "https://youtube.com" },
  'vimeo': { icon: logoVimeo, title: "vimeo", prefix: "https://vimeo.com" },
  'tiktok': { icon: logoTiktok, title: "tiktok", prefix: "https://tiktok.com" },
  'soundcloud': { icon: logoSoundcloud, title: "soundcloud", prefix: "https://soundcloud.com" },
  'stackoverflow': { icon: logoStackoverflow, title: "stackoverflow", prefix: "https://stackoverflow.com" },
  'facebook': { icon: logoFacebook, title: "facebook", prefix: "https://facebook.com" },
  'reddit': { icon: logoReddit, title: "reddit", prefix: "https://reddit.com" },
  'paypal': { icon: logoPaypal, title: "paypal", prefix: "https://paypal.com" },
  'medium': { icon: logoMedium, title: "medium", prefix: "https://medium.com" },
  'twitter': { icon: logoTwitter, title: "twitter", prefix: "https://twitter.com/" },
  'instagram': { icon: logoInstagram, title: "Instagram", prefix: "https://instagram.com/" },
  'github': { icon: logoGithub, title: "github", prefix: "https://github.com/" },
  'gitlab': { icon: logoGitlab, title: "gitlab", prefix: "https://gitlab.com/" },
  'linkedin': { icon: logoLinkedin, title: "linkedin", prefix: "https://linkedin.com/" },
  'xing': { icon: logoXing, title: "xing", prefix: "https://xing.com/" },
  'website': { icon: globeOutline, title: "Website", prefix: "https://" },
}

const DEFAULT_STYLES = {
  "background": "transparent",
  "backgroundImage": "linear-gradient(to right, var(--ion-color-secondary) 0%, var(--ion-color-primary) 100%)"
}

export default defineComponent({
  name: 'Team',
  data(){
    return {
      showQr: false
    }
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const slug: any = route.params.teamSlug;
    const loading = ref(true);
    if (store.getters.teamsBySlug[slug]) {
        loading.value = false;
    } else {
      store.dispatch("teams/fetch", slug).then(() => {
        loading.value = false
      });
    }

    return {
      team: computed(() => store.getters.objectsMap[store.getters.teamsBySlug[slug]]),
      store, loading,
      chatbubbles, logoWhatsapp, uploadIcon: cloudUploadOutline,
      editIcon, qrCodeIcon, imageIcon, trashIcon,
    }
  },
  computed: {
    settings(): Parse.Object {
      return this.store.getters.objectsMap[this.team.get("settings").id];
    },
    info(): string {
      return this.settings.get('info') || ""
    },
    socialLinks(): any[] {
      return ((this.settings || {}).get("socialLinks") || [])
    },
    permissions(): any {
      return this.store.getters["auth/teamPermissions"][this.team.id] || {};
    },
    canEdit(): boolean {
      return this.permissions.isAdmin
    },
    logo(): string | null {
      return (this.settings && this.settings.get("avatar")) ? this.settings.get("avatar").url() : null
    },
    teamStyle(): any {
      const customStyles = this.settings.get('customStyles');
      const extraStyles: any = {};
      const backgroundImage =  this.settings.get("background");
      if (backgroundImage) {
        extraStyles.backgroundImage = `url(${backgroundImage.url()})`;
        extraStyles.backgroundSize = "cover";
      }
      return [DEFAULT_STYLES, customStyles, extraStyles];
    },
    fullLink(): string {
      return "https://yup"
    }
  },
  methods: {
    getSocialIcon(l: string): any {
      return (ICONS[l] || {icon: DEFAULT_ICON}).icon;
    },
    async intendEditInfo() {
      const modal = await modalController
        .create({
          component: GenericEditorModal,
          componentProps: {
            value: this.settings.get('info') || '',
            type: "richtext",
            isAdminMd: true,
            title: "Team Info",
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({"info": res.data.value})
      }
    },
    async intendEditStyles() {
      const modal = await modalController
        .create({
          component: GenericEditorModal,
          componentProps: {
            value: this.settings.get('customStyles'),
            type: "textarea",
            title: "Eigene Styles",
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({"customStyles": res.data.value})
      }
    },
    async intendEditSocialLink() {
      const modal = await modalController
        .create({
          component: EditSocialLinks,
          componentProps: {
            settings: this.settings,
            platforms: Object.keys(ICONS).map((x) => Object.assign({}, {key: x}, ICONS[x])),
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({"socialLinks": res.data.socialLinks})
      }
    },
    async setSetting(params: any) {
      await this.store.dispatch("teams/setSetting", Object.assign({
        id: this.settings.id
      }, params));
    },
    selectNewAvatar() {
      takePicture().then(async (img: typeof CameraPhoto) => {
        const file = new Parse.File(this.team.get("slug") +"_avatar", {uri: img.dataUrl}, "image/" + img.format);
        await file.save();
        await this.setSetting({avatar: file});
      });
    },
    async removeBackground() {
      const alert = await alertController
        .create({
          header: 'Hintergrund löschen?',
          message: 'Soll der Hintergrund wirklich gelöscht werden?',
          buttons: [
            {
              text: 'Abbruch',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Ja, löschen',
              handler: () => {
                this.setSetting({background: null})
              },
            },
          ],
        });
      return alert.present();
    },
    selectBackground() {
      takePicture().then(async (img: typeof CameraPhoto) => {
        const file = new Parse.File(this.team.get("slug") + "_background", {uri: img.dataUrl}, "image/" + img.format);
        await file.save();
        await this.setSetting({background: file});
      });
    }
  },
  components: {
    Avatar, Qrcode, RenderMd,
    IonPage, IonContent, IonIcon, IonChip, IonSpinner, IonButton, IonToolbar,
  }
});
</script>
<style scoped>
.header {
  position: relative;
  display: flex;
  align-content: center;
  align-items: center;
}
ion-toolbar {
  border-bottom: 1px dotted;
  border-top: 1px dotted;
}
.profile-img {
  position: relative;
}
.profile-img ion-chip {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.extra-actions {
  position: absolute;
  bottom: 0;
  right: 0;
}
.social-icons {
  list-style: none;
  padding: 0;
  margin: 0
}
.social-icons li {
  display: inline-block;
  margin-right: 0.2em;
}
.social-icons li a {
  color: var(--ion-color-light);
}
ion-chip ion-icon {
  margin: 0
}
</style>