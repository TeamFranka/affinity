<template>
<div>
  <div data-cy="description">
  <h2 data-cy="title" class="subTitle">
      {{ team.name }}
  </h2>
  <render-md adminMd :source="team.info" />
  <ion-button
      data-cy-role="editModal"
      v-if="canEdit"
      color="primary"
      @click="intendEditInfo"
      size="small"
      fill="clear"
    >
      {{ $t("team.description.edit") }}
    </ion-button>
  </div>

  <h2>{{ $t("team.subteams.title") }}</h2>
  <ul v-if="subteams" class="subteams" data-cy="subteams">
  <li v-for="t in subteams" :key="t.id">
    <router-link
      :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
    >
      <ion-chip outline>
        <avatar withName :profile="t" size="1.5em" />
      </ion-chip>
    </router-link>
  </li>
    <li>
      <ion-chip outline>
        <ion-button
          data-cy="addSubTeamModal"
          v-if="canEdit"
          @click="intendToCreateSubTeam"
          size="small"
          fill="clear"
        >
          <ion-icon size="small" :icon="addIcon" />
        </ion-button>
      </ion-chip>
    </li>
  </ul>
  <ion-button
    v-if="canEdit"
    data-cy-role="edit"
    data-cy-edit-target="styles"
    color="primary"
    @click="intendEditStyles"
    size="small"
    fill="clear"
    style="margin-left: 5%"
  >
    {{$t("team.edit.custom_styles")}}
  </ion-button>
</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/stores/";
import { Model } from "@/utils/model";
import GenericEditorModal from "@/components/settings/generic-editor-modal.vue";
import { Icons } from "@/components/generic/inline-link-list.vue";
import RenderMd from "@/components/render-md.vue";
import Avatar from "@/components/avatar.vue";
import EditLinks from "@/components/settings/edit-links.vue";
import CreateSubTeam from "@/components/settings/create-subteam.vue";
import {
  IonChip,
  IonButton,
  IonIcon,
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
    permissions(): any {
      return (
        this.store.getters["auth/teamPermissions"][this.team.objectId] || {}
      );
    },
    canEdit(): boolean {
      return this.permissions.isAdmin;
    },
    socialLinks(): any[] {
      return this.team.socialLinks || [];
    },
    footerLinks(): any[] {
      return this.team.footerLinks || [];
    },
    subteams(): Model[] {
      if (!this.team) {
        return [];
      }
      const teamId = this.team.objectId;
      return (this.store.state.teams.subteams[teamId] || []).map(
        (id: string) => this.store.getters["objectsMap"][id]
      );
    },
    info(): string {
      return this.team.info || "";
    },
  },
  methods: {
    async setSetting(params: any) {
      const model = this.team.prepareSave(params);
      await this.store.dispatch("updateModel", model);
    },
    async intendToCreateSubTeam() {
      const modal = await modalController.create({
        component: CreateSubTeam,
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        const data = res.data;
        data.subOf = this.team.toPointer();
        const subteam = await this.store.dispatch("teams/createSubteam", data);
        this.$router.push({
          name: "ViewTeam",
          params: { teamSlug: subteam.slug },
        });
      }
    },
    async intendEditTitle() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.name || "",
          type: "text",
          title: this.$t("team.modal.editTitle.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ name: res.data.value });
      }
    },
    async intendEditInfo() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.info || "",
          type: "richtext",
          isAdminMd: true,
          title: this.$t("team.modal.editInfo.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ info: res.data.value });
      }
    },
    async intendEditStyles() {
      const modal = await modalController.create({
        component: GenericEditorModal,
        componentProps: {
          value: this.team.customStyles,
          type: "textarea",
          help: this.$t("team.modal.editCustomStyles.help"),
          title: this.$t("team.modal.editCustomStyles.title"),
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ customStyles: res.data.value });
      }
    },
    async intendEditFooterLinks() {
      const modal = await modalController.create({
        component: EditLinks,
        componentProps: {
          items: Array.from(this.footerLinks),
          withIcons: false,
          saveLabel: this.$t("team.modal.button.save"),
        },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.setSetting({ footerLinks: res.data.items });
      }
    },
    async intendEditSocialLink() {
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
        await this.setSetting({ socialLinks: res.data.items });
      }
    },
  },
  components: {
    IonButton,
    IonChip,
    IonIcon,
    Avatar,
    RenderMd,
  }
})
</script>
<style scoped>

</style>
