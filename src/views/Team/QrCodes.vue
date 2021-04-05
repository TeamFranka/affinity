<template>
  <div class="ion-padding">
    <qrcode
      :text="fullLink"
      :logo="logo"
      :height="256"
      :width="256"
    />
    <div v-for="l in team.socialLinks" :key="l.target">
    <qrcode
      :text="l.target"
      :logo="getSocialIcon(l.platform)"
      class="socialLinks"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { DefaultIcon, Icons } from "@/components/generic/inline-link-list.vue";
import { useStore } from "@/stores/";
import { Model } from "@/utils/model";
import { absoluteUrl } from "@/utils/url";
import Qrcode from "@/components/qrcode.vue";
import {
  IonChip,
  IonButton,
  modalController,
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

export default defineComponent({
  setup() {
    const store = useStore();
    return {
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
  computed: {
    team(): Model {
      const slug: any = this.$route.params.teamSlug;
      return this.store.getters.objectsMap[
        this.store.getters.teamsBySlug[slug]
      ];
    },
    fullLink(): string {
      return absoluteUrl(this.$router, {
        name: "ViewTeam",
        params: { teamSlug: this.team.slug },
      });
    },
  },
  methods: {
    getSocialIcon(l: string): any {
      return (Icons[l] || { icon: DefaultIcon }).icon;
    },
  },
  components: {
    Qrcode,
  }
})
</script>
<style scoped>

</style>
