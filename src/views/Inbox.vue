<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-list>
        <ion-list-header>
          <ion-segment value="conversation">
              <ion-segment-button value="conversation">
                <ion-label>Conversations</ion-label>
              </ion-segment-button>
                <ion-segment-button value="notifications">
                <ion-label>Notifications</ion-label>
              </ion-segment-button>
          </ion-segment>
        </ion-list-header>

        <ion-item v-for="convo in convos" :key="convo.id" lines="inset">
          <ion-avatar slot="start">
            <img src="https://randomuser.me/api/portraits/women/29.jpg">
          </ion-avatar>
          <ion-label>
            <h2>{{convo.get("participants")[0].name}}</h2>
            <p>{{convo.get("latestMessage") && convo.get("latestMessage").get("text")}}</p>
          </ion-label>
          <div class="meta" slot="end">
            <ion-note color="medium">21:12</ion-note><br/>
            <ion-badge color="danger">3</ion-badge>
          </div>
        </ion-item>

        <ion-item lines="inset">
          <ion-avatar slot="start">
            <img src="https://randomuser.me/api/portraits/women/29.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Fina</h2>
            <p>Listen, I've had a pretty messed up day...</p>
            <ion-chip outline="true" color="danger">
              <ion-icon :icon="logoWhatsapp" />
              TeamFranka <ion-icon :icon="isNew" />
            </ion-chip>
          </ion-label>
          <div class="meta" slot="end">
            <ion-note color="medium">21:12</ion-note><br/>
            <ion-badge color="danger">3</ion-badge>
          </div>

        </ion-item>


        <ion-item>
          <ion-avatar slot="start">
            <img src="https://randomuser.me/api/portraits/men/41.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Han</h2>
            <p>I've got enough on my plate as it is, and I...</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-avatar slot="start">
            <img src="https://www.fakepersongenerator.com/Face/male/male1084893938995.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Rey</h2>
            <p>You will remove these restraints and leave...</p>
            <ion-chip outline="true" color="medium">
                <ion-icon :icon="mail" /> TeamFranka
              <ion-avatar>
                <img src="https://randomuser.me/api/portraits/women/95.jpg">
              </ion-avatar>
            </ion-chip>
          </ion-label>
          <div class="meta" slot="end">
            <ion-note color="medium">20:30</ion-note><br/>
            <ion-badge color="medium">5</ion-badge>
          </div>
        </ion-item>

        <ion-item>
          <ion-avatar slot="start">
            <img src="https://www.fakepersongenerator.com/Face/female/female20161025799603332.jpg">
          </ion-avatar>
          <ion-label>
            <h2>TeamFranka TeamChat</h2>
            <p>Hannah: I feel the good in you, the conflict...</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonSegment, IonSegmentButton, IonChip, IonIcon, IonAvatar, IonLabel, IonList, IonListHeader, IonItem, IonBadge, IonNote,
} from '@ionic/vue';
import { chatbubbles, logoWhatsapp, folderOpenOutline, mailOutline } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';

export default defineComponent({
  name: 'Inbox',
  setup() {
    const store = useStore();
    return {
      loading: computed(() => store.getters["inbox/loading"]),
      refresh(){ store.dispatch("inbox/refresh"); },
      convos: computed(() => store.getters["inbox/latest"]),
      chatbubbles, logoWhatsapp, isNew: folderOpenOutline, mail: mailOutline,
    }
  },
  mounted() {
    if (!this.loading && this.convos.length === 0) {
      this.refresh();
    }
  },
  components: {
    IonContent, IonPage, IonAvatar,
    IonSegment, IonSegmentButton, IonLabel, IonChip, IonIcon, IonList, IonListHeader, IonItem, IonBadge, IonNote
  }
});
</script>

<style scoped>
.meta {
  text-align: right;
}
</style>