<template>
  <ion-page>
    <ion-content fullscreen>
        <div class="ion-text-center">
            <avatar :profile="user" canEdit @edit="selectNewAvatar(user.id)" />
        </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from '../components/avatar.vue';
import { IonContent, IonPage, } from '@ionic/vue';
import { chatbubbles, logoWhatsapp } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import { Plugins, CameraResultType } from '@capacitor/core';
import Parse from 'parse';

const { Camera, CameraPhoto } = Plugins;

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl
  });
  return image
}



export default defineComponent({
  name: 'Me',
  setup() {
    const store = useStore();

    return {
      user: computed(() => store.state.auth.user ),
      setUserAvatar: (f: Parse.File) => store.dispatch("auth/setAvatar", f),
      chatbubbles, logoWhatsapp
    }
  },
  methods: {
    selectNewAvatar(userId: string) {
      takePicture().then((img: typeof CameraPhoto) => {
        // console.log("selected", img);
        const file = new Parse.File(userId +"_avatar", {uri: img.dataUrl}, "image/" + img.format);
        this.setUserAvatar(file);
      });
    }
  },
  components: {
    Avatar,
    IonPage,
    IonContent,
  }
});
</script>