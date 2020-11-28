<template>
  <ion-menu side="start" content-id="main-content">
    <ion-header>
      <ion-toolbar translucent>
        <ion-title>Affinity</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-icon name="mail" slot="start"></ion-icon>
          <ion-label>Inbox</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="paper-plane" slot="start"></ion-icon>
          <ion-label>Outbox</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="heart" slot="start"></ion-icon>
          <ion-label>Favorites</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="archive" slot="start"></ion-icon>
          <ion-label>Archived</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="trash" slot="start"></ion-icon>
          <ion-label>Trash</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon name="warning" slot="start"></ion-icon>
          <ion-label>Spam</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>


<script lang="ts">
import {
  IonIcon, IonMenu, IonList, IonLabel, IonItem,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SideMenu',
  components: {
    IonIcon,
    IonMenu, IonList, IonLabel, IonItem,
  }
});
</script>