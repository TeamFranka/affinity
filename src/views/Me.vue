<template>
  <ion-page>
    <ion-content>
      <profile-card
        :profile="user"
        :can-edit="true"
        :show-qr="true"
      />
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
import { IonContent, IonPage } from "@ionic/vue";
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
