<template>
  <ion-tab-bar>
    <ion-tab-button tab="home" href="/home">
        <ion-icon :icon="homeIcon"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="feed" href="/feed">
        <ion-icon :icon="feedIcon"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="faq" href="/faq">
        <ion-icon :icon="faqIcon"></ion-icon>
    </ion-tab-button>
    <ion-tab-button tab="donations" href="/donate">
        <ion-icon :icon="donationsIcon"></ion-icon>
    </ion-tab-button>
  </ion-tab-bar>
</template>


<script lang="ts">
import {
  IonIcon, IonTabBar, IonTabButton,
} from '@ionic/vue';
import { planetOutline, listOutline, peopleCircleOutline, walletOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterMenu',
  setup() {
      return {
          homeIcon: planetOutline,
          feedIcon: peopleCircleOutline,
          donationsIcon: walletOutline,
          faqIcon: listOutline,
      }
  },
  components: {
    IonIcon,
    IonTabBar,
    IonTabButton,
  }
});
</script>