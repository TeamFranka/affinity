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

        <ion-item
          button
          details=false
          @click="selectConversation  (convo.id)"
          v-for="convo in convos"
          :key="convo.id"
          lines="inset"
          >
          <conversation-entry :convo="convo" />
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonListHeader, IonItem,
} from '@ionic/vue';
import { chatbubbles, logoWhatsapp, folderOpenOutline, mailOutline } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import ConversationEntry from "../components/conversation-entry.vue";
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
  methods:{
    selectConversation(conversationId: string) {
      this.$router.push({name: "Conversation", params:{ conversationId }});
    },
  },
  mounted() {
    if (!this.loading && this.convos.length === 0) {
      console.log("refreshing");
      this.refresh();
    }
  },
  components: {
    IonContent, IonPage,
    ConversationEntry,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonListHeader, IonItem,
  }
});
</script>

<style scoped>
.meta {
  text-align: right;
}
</style>