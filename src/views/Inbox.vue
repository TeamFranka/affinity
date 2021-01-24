<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-list>
        <ion-list-header>
          <ion-segment @ionChange="selectedSegment = $event.target.value" :value="selectedSegment">
              <ion-segment-button value="convos">
                <ion-label>Conversations</ion-label>
              </ion-segment-button>
                <ion-segment-button value="notifications">
                <ion-label>Notifications</ion-label>
              </ion-segment-button>
          </ion-segment>
        </ion-list-header>

        <template v-if="selectedSegment == 'convos'">
          <ion-item
            button
            details=false
            @click="selectConversation  (convo.objectId)"
            v-for="convo in convos"
            :key="convo.objectId"
            lines="inset"
            >
            <conversation-entry :convo="convo" />
          </ion-item>
        </template>
        <template v-else>
          <ion-item
            button
            details=false
            v-for="n in notifications"
            :key="n.objectId"
            lines="none"
            >
            <avatar size="2em" with-name :profile="n.by" />
            <div v-if="n.verb == 'react'"
              class="ion-padding-start"
            >
              reacted with {{(n.specifics||{})["reaction"]}}
              on <object-link mine :object="n.objects[0]" />
            </div>
            <div v-else-if="n.verb == 'like'"
              class="ion-padding-start"
            >
              ❤️ <object-link mine :object="n.objects[0]" />
            </div>
            <div v-else-if="n.verb == 'comment'"
              class="ion-padding-start"
            >
              kommentierte <object-link mine :object="n.objects[0]" />
            </div>
            <div v-else>
              {{n}}
            </div>
            <span class="meta" slot="start">{{smartTimestamp(n.createdAt)}}</span>
          </ion-item>

        </template>
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
import Avatar from "../components/avatar.vue";
import ObjectLink from "../components/object-link.vue";
import { useStore } from '../stores/';
import { smartTimestamp } from '../utils/time';

export default defineComponent({
  name: 'Inbox',
  data(){
    return {
      selectedSegment: "convos",
    }
  },
  setup() {
    const store = useStore();
    return {
      smartTimestamp,
      loading: computed(() => store.getters["inbox/loading"]),
      refresh(){ store.dispatch("inbox/refresh"); },
      convos: computed(() => store.getters["inbox/latest"]),
      notifications: computed(() => store.getters["inbox/notifications"]),
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
      this.refresh();
    }
  },
  components: {
    IonContent, IonPage,
    ConversationEntry, Avatar, ObjectLink,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonListHeader, IonItem,
  }
});
</script>

<style scoped>
.meta {
  font-size: 0.8em;
  color: var(--ion-color-medium);
}
</style>