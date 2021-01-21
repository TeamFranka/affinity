<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <ion-spinner v-if="loading"/>
        <template v-else>
          <div class="header" :style="teamStyle">
            <div class="profile-img ion-padding">
              <avatar size="10rem" :profile="team" />
              <ion-chip v-if="canEdit" @click="selectNewAvatar()">
                <ion-icon :icon="uploadIcon"></ion-icon>
              </ion-chip>
            </div>
            <div class="ion-padding">
              <h1>
                {{team.get('name')}}
                <ion-button v-if="canEdit" color="light" @click="intendEditTitle" fill="clear">
                  <ion-icon size="small" :icon="editIcon" />
                </ion-button>
              </h1>
              <inline-link-list :items="socialLinks" showIcon>
                <li v-if="canEdit">
                  <ion-button @click="intendEditSocialLink" color="light" size="small" fill="clear">
                    <ion-icon size="small" :icon="editIcon" />
                  </ion-button>
                </li>
              </inline-link-list>
              <render-md adminMd :source="info" />
              <ion-button v-if="canEdit" color="light" @click="intendEditInfo" size="small" fill="clear">
                Edit Text
              </ion-button>
            </div>
            <div class="extra-actions" v-if="canEdit">
              <ion-chip title="remove background" v-if="team.get('background')" @click="removeBackground">
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
          <ion-toolbar>
            <ion-button size="small" @click="showQr = !showQr" fill="clear">
              <ion-icon size="small" :icon="qrCodeIcon" />
            </ion-button>
            <div slot="end">
              <inline-link-list showTitle :items="footerLinks">
                <li v-if="canEdit">
                  <ion-button @click="intendEditFooterLinks" size="small" fill="clear">
                    <ion-icon size="small" :icon="editIcon" />
                  </ion-button>
                </li>
              </inline-link-list>
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
import RenderMd from '@/components/render-md.vue';
import Avatar from '@/components/avatar.vue';
import { DefaultIcon, Icons } from '@/components/generic/inline-link-list.vue';
import InlineLinkList from '@/components/generic/inline-link-list.vue';
import EditLinks from '@/components/settings/edit-links.vue';
import GenericEditorModal from '@/components/settings/generic-editor-modal.vue';
import Qrcode from '@/components/qrcode.vue';
import {
  IonContent, IonPage,  IonIcon, IonChip, IonSpinner, IonButton,
  modalController, alertController, IonToolbar,
} from '@ionic/vue';
import {
  chatbubbles, logoWhatsapp, cloudUploadOutline,
  trashOutline as trashIcon,
  imageOutline as imageIcon,
  qrCodeOutline as qrCodeIcon,
  createOutline as editIcon,
} from 'ionicons/icons';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '@/stores/';
import { useRoute } from 'vue-router';
import Parse from 'parse';
import { takePicture, CameraPhoto } from '@/utils/camera';

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
    info(): string {
      return this.team.get('info') || ""
    },
    socialLinks(): any[] {
      return this.team.get("socialLinks") || []
    },
    footerLinks(): any[] {
      return this.team.get("footerLinks") || []
    },
    permissions(): any {
      return this.store.getters["auth/teamPermissions"][this.team.id] || {};
    },
    canEdit(): boolean {
      return this.permissions.isAdmin
    },
    logo(): string | null {
      return (this.team && this.team.get("avatar")) ? this.team.get("avatar").url() : null
    },
    teamStyle(): any {
      const customStyles = this.team.get('customStyles');
      const extraStyles: any = {};
      const backgroundImage =  this.team.get("background");
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
      return (Icons[l] || {icon: DefaultIcon}).icon;
    },
    async intendEditTitle() {
      const modal = await modalController
        .create({
          component: GenericEditorModal,
          componentProps: {
            value: this.team.get('name') || '',
            type: "text",
            title: "Team Name",
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.team.save({"name": res.data.value});
      }
    },
    async intendEditInfo() {
      const modal = await modalController
        .create({
          component: GenericEditorModal,
          componentProps: {
            value: this.team.get('info') || '',
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
            value: this.team.get('customStyles'),
            type: "textarea",
            help: "Hier kannst du die globalen css-Style-Variablen des Theme überschreiben. Siehe dazu [den Ionic Theming Guide](https://ionicframework.com/docs/theming/css-variables) und den [praktischen Color Generator](https://ionicframework.com/docs/theming/color-generator)",
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
    async intendEditFooterLinks() {
      const modal = await modalController
        .create({
          component: EditLinks,
          componentProps: {
            items: Array.from(this.footerLinks),
            withIcons: false,
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({"footerLinks": res.data.items})
      }
    },
    async intendEditSocialLink() {
      const modal = await modalController
        .create({
          component: EditLinks,
          componentProps: {
            items: Array.from(this.socialLinks),
            withIcons: true,
            platforms: Object.keys(Icons).map((x) => Object.assign({}, {key: x}, Icons[x])),
            saveLabel: "Speichern",
          },
        })
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({"socialLinks": res.data.items})
      }
    },
    async setSetting(params: any) {
      await this.store.dispatch("teams/setSetting", Object.assign({
        id: this.team.id
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
    Avatar, Qrcode, RenderMd, InlineLinkList,
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
  --menu-color: var(--ion-color-light);
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
ion-chip ion-icon {
  margin: 0
}
</style>