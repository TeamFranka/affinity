<template>
    <ion-page>
      <ion-split-pane content-id="main">
        <!--  the community side menu  -->
        <ion-menu content-id="main" side="start" class="ion-padding">

          <ion-content >
            <ion-list lines="none">
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
            </ion-list>
          </ion-content>
          <ion-footer class="ion-padding">
            Impressum
          </ion-footer>
        </ion-menu>
        <ion-router-outlet id="main"/>
      </ion-split-pane>
    </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonRouterOutlet,
  IonMenu, IonList, IonItem, IonFooter, IonSplitPane,
} from '@ionic/vue';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'CommunityOutlet',
  components: {
    IonPage, IonContent, IonRouterOutlet,
    IonMenu, IonList, IonItem, IonFooter, IonSplitPane,
  }
});
</script>
<style scoped>
ion-split-pane {
  --border: unset;
}
</style>