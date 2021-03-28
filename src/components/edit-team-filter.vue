<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-button class="closeIcon" color="dark" fill="clear" @click="closeModal" slot="start">
          <ion-icon :icon="closeIcon" />
        </ion-button>

        <ion-title>{{ $t('teamFilter.title')}}</ion-title>
        <ion-buttons slot="end" class="ion-padding" data-cy="save" @click="saveAndClose">
          <ion-text color="primary">{{ $t('teamFilter.button.save')}}</ion-text>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <ion-item lines="none" class="ion-margin-bottom ion-margin-top">
        <ion-toggle
          :checked="showName"
          color="primary"
          @ionChange="showName= $event.detail.checked"
        />
        <ion-label>{{$t('teamFilter.showTeamName')}}</ion-label>
      </ion-item>

      <ion-reorder-group reorder="true" @ionItemReorder="doReorder($event)">
         <ion-item
            v-for="(entry, idx) in visibleTabs"
            :key="entry.value"
          >
            <ion-toggle
              slot="start"
              color="primary"
              :data-cy-entry="entry.team  ? entry.team.slug : entry.value"
              :checked="entry.show"
              @ionChange="tabs[idx].show = $event.detail.checked"
            />
            <ion-label v-if="entry.team">
              <avatar
                size="1.8rem"
                :profile="entry.team"
                with-name
              />
            </ion-label>
            <template v-else>
              <ion-icon :icon="entry.icon" />
                <ion-label class="ion-margin-start">{{entry.title}}</ion-label>
            </template>

            <ion-reorder></ion-reorder>

        </ion-item>

      </ion-reorder-group>
</ion-content>
</ion-page>
</template>


<script lang="ts">
import {
 IonLabel,
 IonItem,
 IonToggle,
 modalController,
 IonHeader,
 IonIcon,
 IonText,
 IonPage,
 IonButton,
 IonButtons,
 IonTitle,
 IonToolbar,
 IonContent,
 IonReorderGroup,
 IonReorder
} from '@ionic/vue';

import clonedeep from 'lodash/cloneDeep';
import {
   closeOutline as closeIcon,globeOutline as globeIcon
} from 'ionicons/icons';
import Avatar from "@/components/avatar.vue";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import { ItemReorderEventDetail } from '@ionic/core';
export default defineComponent({
  name: 'EditTeamFilter',
  props: {
    currentSettings: {
      type: Object,
      required: true
    },
    remap: {
      required: true
    }
  },
  data(props: any) {
    return {
      showName: props.currentSettings.showName,
      tabs: clonedeep(props.currentSettings.tabs)
    }
  },
  setup() {
    const store = useStore();
    return {
      store,
      teamsMap: computed(() => store.getters.objectsMap),
      closeModal() {
        modalController.dismiss()
      },
      closeIcon,
      globeIcon
    }
  },
  computed: {
    visibleTabs(): any[] {
      return (this.tabs as any)
        .map((e:any) =>
            Object.assign({}, e, e.team ? {team: this.teamsMap[e.team]} : (this.remap as any)(e.default))
        );
    }
  },
  methods:{
    doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
      console.log("reordering", ev);
    },
    saveAndClose() {
      modalController.dismiss({
        showName: this.showName ? true : false,
        tabs: this.tabs
      });
    },
  },
  components: {
    IonLabel,
    IonItem,
    IonToggle,
    IonHeader,
    IonIcon,
    Avatar,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonContent,
    IonReorderGroup,
    IonReorder,
    IonText,
    IonPage,
  }
});
</script>

<style scoped>
</style>