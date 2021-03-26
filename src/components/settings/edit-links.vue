<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        {{ $t("admin.editLinks.title") }}
      </ion-title>
      <ion-button color="dark" fill="clear" @click="closeModal" slot="end">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item v-for="(i, index) in innerItems" :key="i.target">
        <ion-button
          v-if="withIcons"
          @click="selectIcon($event, index)"
          size="small"
          color="medium"
          fill="outline"
          slot="start"
        >
          <ion-icon :icon="(icons[i.platform] || {}).icon || defaultIcon" />
        </ion-button>
        <div>
          <ion-input
            :value="i.title"
            @change="i.title = $event.target.value"
            type="text"
            placeholder="Title"
          />
          <ion-input
            :value="i.target"
            @change="i.target = $event.target.value"
            type="url"
            placeholder="http://"
          />
        </div>
        <ion-button
          color="medium"
          fill="clear"
          @click="removeOption(index)"
          slot="end"
        >
          <ion-icon :icon="removeIcon" />
        </ion-button>
      </ion-item>
      <ion-item>
        <ion-button @click="addOption" fill="outline">
          <ion-icon :icon="addIcon" />
          {{ $t("admin.editLinks.button.add") }}
        </ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-button
        fill="outline"
        :disabled="!canSubmit"
        @click="saveAndClose"
        slot="end"
      >
        <ion-icon :icon="saveIcon" />
        <ion-label>
          {{ saveLabel || $t("admin.editLinks.button.save") }}</ion-label
        >
      </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonIcon,
  IonButton,
  modalController,
  IonFooter,
  IonLabel,
  IonItem,
  IonList,
  IonTitle,
  popoverController,
} from "@ionic/vue";
import {
  closeOutline as closeIcon,
  saveOutline as saveIcon,
  listOutline as listIcon,
  addCircleOutline as addIcon,
  trashOutline as removeIcon,
  globeOutline,
} from "ionicons/icons";
import IconSelector from "./icon-selector.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditLinks",
  components: {
    IonContent,
    IonToolbar,
    IonInput,
    IonHeader,
    IonIcon,
    IonButton,
    IonFooter,
    IonLabel,
    IonItem,
    IonList,
    IonTitle,
  },
  props: {
    saveLabel: {
      type: String,
    },
    platforms: {
      type: Array,
      default: () => [],
    },
    withIcons: {
      type: Boolean,
    },
    items: {
      type: Array,
      required: true,
    },
    defaultIcon: {
      default: globeOutline,
    },
  },
  data(props) {
    const icons: Record<string, any> = {};
    (props.platforms || []).forEach((x: any) => {
      icons[x.key] = x;
    });
    return {
      innerItems: Array.from(props.items),
      icons,
    };
  },
  setup() {
    return {
      closeModal() {
        modalController.dismiss();
      },
      saveIcon,
      closeIcon,
      addIcon,
      listIcon,
      removeIcon,
    };
  },
  computed: {
    canSubmit(): boolean {
      return !this.items.find((x: any) => !x.title || !x.target);
    },
  },
  methods: {
    async selectIcon(ev: Event, index: number) {
      const popover = await popoverController.create({
        component: IconSelector,
        componentProps: {
          icons: this.platforms,
          selected: (this.innerItems[index] as any).platform,
        },
        event: ev,
        translucent: true,
      });
      await popover.present();

      const res = await popover.onDidDismiss();
      if (res.data) {
        await this.setPlatform(index, res.data);
      }
    },
    setPlatform(index: number, entry: any) {
      const item: any = this.innerItems[index];
      item.platform = entry.key;
      if (!item.target) {
        item.target = entry.prefix;
      }
    },
    saveAndClose() {
      modalController.dismiss({ items: this.innerItems });
    },
    addOption() {
      this.innerItems.push({});
    },
    removeOption(idx: number) {
      this.innerItems.splice(idx, 1);
    },
  },
});
</script>
