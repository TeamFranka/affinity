<template>
<div>
  <div class="header" :style="profileStyle">
    <ion-col size-md="2" size-lg="2" size-sm="2" size-xs="3">
      <div data-cy-role="avatar" class="profile-img">
        <avatar size="7rem" :profile="profile" />
        <ion-chip data-cy="setAvatar" v-if="canEdit" @click="$emit('intend-select-avatar')">
          <ion-icon :icon="uploadIcon"></ion-icon>
        </ion-chip>
      </div>
    </ion-col>

    <ion-col size-xl="8" size-md="8" size-sm="8" size-xs="7" offset="2">
        <h1 data-cy="title">
        {{ profile.name }}
        <ion-icon
            size="small"
            :icon="editIcon"
            data-cy-role="editModal"
            v-if="canEdit"
            color="light"
            @click="$emit('intend-edit-title')"
        />
        </h1>

        <inline-link-list :items="profile.socialLinks" showIcon>
          <span v-if="canEdit">
            <ion-icon
            size="small"
            data-cy-role="editModal"
            :icon="editIcon"
            @click="$emit('intend-edit-social-links')"
            color="light"
            />
          </span>
        </inline-link-list>
        <div data-cy="info" v-if="showInfo" >
          <render-md inline v-if="info" :source="info" />
          <span v-if="canEdit">
            <ion-icon
            size="small"
            data-cy-role="editModal"
            :icon="editIcon"
            @click="$emit('intend-edit-info')"
            color="light"
            />
          </span>
        </div>

        <div class="extra-actions" v-if="canEdit">
          <ion-chip
            data-cy="removeBackground"
            v-if="profile.background"
            @click="$emit('remove-background')"
            outline
          >
            <ion-icon :icon="imageIcon" />
            <ion-icon :icon="trashIcon" />
          </ion-chip>

        <ion-chip
          v-else
          data-cy="setBackground"
          @click="$emit('intend-select-background')"
        >
            <ion-icon :icon="imageIcon" />
            <ion-icon :icon="uploadIcon" />
        </ion-chip>
        </div>
    </ion-col>
  </div>
  <slot name="menu"></slot>

  <ion-toolbar v-if="showMenu">
    <ion-segment
      scrollable
      mode="md"
      :value="segmentsValue"
      @ionChange="$emit('segment-selected', $event.detail.value)"
    >
      <ion-segment-button v-if="showQr" value="qrcode">
        <ion-icon :icon="qrCodeIcon" />
      </ion-segment-button>
      <ion-segment-button
        v-for="s in segments"
        :value="s.value"
        :key="s.value"
      >
        <ion-label>{{ s.title }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCol,
  IonIcon,
  IonChip,
} from "@ionic/vue";
import {
  cloudUploadOutline as uploadIcon,
  trashOutline as trashIcon,
  imageOutline as imageIcon,
  qrCodeOutline as qrCodeIcon,
  createOutline as editIcon,
} from "ionicons/icons";
import InlineLinkList from "@/components/generic/inline-link-list.vue";
import Avatar from "@/components/avatar.vue";
import { Model } from "@/utils/model";
import RenderMd from "./render-md.vue";

const DEFAULT_STYLES = {
  background: "transparent",
  backgroundImage:
    "linear-gradient(to right, var(--ion-color-secondary) 0%, var(--ion-color-primary) 100%)",
};

export default defineComponent({
  emits: [
    // edits
    'intend-select-avatar',
    'intend-edit-title',
    'intend-edit-info',
    'intend-edit-social-links',
    'intend-select-background',
    'remove-background',

    // signaling action
    'segment-selected'],
  props: {
    canEdit: {
      type: Boolean,
      required: true,
    },
    profile: {
      type: Model,
      required: true
    },
    info: {
      type: String,
    },
    showInfo: {
      type: Boolean,
    },
    showQr: {
      type: Boolean,
      required: true,
    },
    showMenu: {
      type: Boolean,
      required: true,
    },
    segments: {
      type: Array,
    },
    segmentsValue: {
      type: String,
    }
  },
  setup() {
    return {
      editIcon, qrCodeIcon, trashIcon, imageIcon,
      uploadIcon,
    }
  },
  computed: {
    profileStyle(): any {
      const customStyles = this.profile.customStyles;
      const extraStyles: any = {};
      const backgroundImage = this.profile.background;
      if (backgroundImage) {
        extraStyles.backgroundImage = `url(${backgroundImage.url})`;
        extraStyles.backgroundSize = "cover";
      }
      return [DEFAULT_STYLES, customStyles, extraStyles];
    },
  },
  components: {
    InlineLinkList,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCol,
    IonIcon,
    IonChip,
    Avatar,
    RenderMd,
  }
})
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
.body {
  display: block;
  overflow-y: auto;
  height: 60vh;
}
h1 {
  font-size: 13px;
  text-transform: uppercase;
  margin-left: -5%;
  margin-top: -5%;
}
h2 {
  font-size: 18px;
  font-weight: 400;
}
p {
  font-size: 14px;
  margin: 5%;
  padding-bottom: 5%;
}
h2.subTitle {
  text-transform: uppercase;
}
.profile-img {
  position: relative;
  margin: 2% 5%;
}
.profile-img ion-chip {
  position: absolute;
  bottom: 0;
  left: 80%;
  margin: 0%;
  transform: translateX(-50%);
}
.extra-actions {
  position: absolute;
  bottom: 0;
  right: 0;
}
ion-chip ion-icon {
  margin: 0;
}
ion-icon {
  cursor: pointer;
}
li {
  padding: 0% !important;
}
.socialLinks {
  float: left;
  text-align: center;
  margin: 3%;
}
</style>