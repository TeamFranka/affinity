<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <ion-spinner v-if="loading"/>
        <div v-if="!loading">
          <div class="ion-text-center">
            <div class="profile-img">
              <avatar size="10rem" :profile="settings" :name="team.name"  />
            </div>
            <ion-chip v-if="canEdit" @click="selectNewAvatar()">
              <ion-icon :icon="uploadIcon"></ion-icon>
            </ion-chip>
          </div>
        </div>
        <div v-if="!loading">
          <qrcode :text="fullLink" :logo="logo" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from '../components/avatar.vue';
import Qrcode from '../components/qrcode.vue';
import { IonContent, IonPage,  IonIcon, IonChip, IonSpinner } from '@ionic/vue';
import { chatbubbles, logoWhatsapp, cloudUploadOutline } from 'ionicons/icons';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../stores/';
import { useRoute } from 'vue-router';
import Parse from 'parse';
import { takePicture, CameraPhoto } from '../utils/camera';

export default defineComponent({
  name: 'Team',
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
      chatbubbles, logoWhatsapp, uploadIcon: cloudUploadOutline
    }
  },
  computed: {
    settings(): Parse.Object {
      return this.store.getters.objectsMap[this.team.get("settings").id];
    },
    permissions(): any {
      return this.store.getters["auth/teamPermissions"][this.team.id] || {};
    },
    canEdit(): boolean {
      console.log(this.permissions);
      return this.permissions.isAdmin
    },
    logo(): string | null {
      return (this.settings && this.settings.get("avatar")) ? this.settings.get("avatar").url() : null
    },
    fullLink(): string {
      return "https://yup"
    }
  },
  methods: {
    setSetting(params: any) {
      this.store.dispatch("teams/setSetting", Object.assign({
        id: this.settings.id
      }, params));
    },
    selectNewAvatar() {
      takePicture().then(async (img: typeof CameraPhoto) => {
        const file = new Parse.File(this.team.get("slug") +"_avatar", {uri: img.dataUrl}, "image/" + img.format);
        await file.save();
        await this.setSetting({avatar: file});
      });
    }
  },
  components: {
    Avatar,
    Qrcode,
    IonPage,
    IonContent,
    IonIcon,
    IonChip,
    IonSpinner,
  }
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0
}
</style>