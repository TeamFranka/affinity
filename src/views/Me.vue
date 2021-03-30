<template>
  <ion-page>
    <ion-content>
      <div class="ion-text-center">
        <div data-role="myAvatar" class="profile-img">
          <avatar :profile="user" />
        </div>
        <ion-button
          data-cy="setAvatar"
          fill="clear"
          color="medium"
          @click="selectNewAvatar(user.objectId)"
        >
          <ion-icon :icon="uploadIcon"></ion-icon>
        </ion-button>
      </div>
      <div data-cy="my-teams">
        <h2>{{ $t("me.membership.title") }}</h2>
        <router-link
          v-for="t in myTeams"
          :key="t.id"
          :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
        >
          <avatar :profile="t" withName />
        </router-link>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from "../components/avatar.vue";
import { IonContent, IonPage, IonIcon, IonButton } from "@ionic/vue";
import { chatbubbles, logoWhatsapp, cloudUploadOutline } from "ionicons/icons";
import { defineComponent, computed } from "vue";
import { useStore } from "../stores/";
import Parse from "parse";
import { takePicture, Photo } from "../utils/camera";

export default defineComponent({
  name: "Me",
  setup() {
    const store = useStore();

    return {
      user: computed(() => store.state.auth.user),
      myTeams: computed(() => store.getters["auth/myTeams"]),
      setUserAvatar: (f: Parse.File) => store.dispatch("auth/setAvatar", f),
      chatbubbles,
      logoWhatsapp,
      uploadIcon: cloudUploadOutline,
    };
  },
  methods: {
    selectNewAvatar(userId: string) {
      takePicture().then((img: Photo) => {
        const file = new Parse.File(
          userId + "_avatar",
          { uri: img.dataUrl },
          "image/" + img.format
        );
        this.setUserAvatar(file);
      });
    },
  },
  components: {
    Avatar,
    IonPage,
    IonContent,
    IonIcon,
    IonButton,
  },
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0;
}
.profile-img {
  width: 50%;
}
</style>
