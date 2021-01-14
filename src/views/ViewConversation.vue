<template>
  <ion-page>
    <ion-header>
      <ion-buttons slot="start">
        <ion-back-button />
      </ion-buttons>
      <ion-item>
        <conversation-entry brief v-if="!loading" :convo="conversation" />
      </ion-item>
    </ion-header>
    <ion-content>
      <main class="ion-padding">
        <div
          :class="clsForMsg(m)"
          v-for="m in messages"
          :key="m.id"
        >
          <div class="message">{{m.get("text")}}</div>
          <div class="meta">{{smartTimestamp(m.get("createdAt"))}}</div>
        </div>
      </main>
      <ion-spinner v-if="loading" />
    </ion-content>
    <ion-footer>
        <inline-text
          placeholder="Nachricht schreiben"
          :value="currentMessage"
          :canSubmit="currentMessage.length > 0"
          @changed="currentMessage = $event"
          @submit="sendMessage"
        />
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import InlineText from "../components/inline-text.vue";
import {
  IonPage, IonContent, IonSpinner, IonFooter, IonButtons, IonBackButton,
  IonHeader, IonItem, IonTitle,
} from '@ionic/vue';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../stores/';
import { useRoute } from 'vue-router';
import { smartTimestamp } from '../utils/time';
import ConversationEntry from "../components/conversation-entry.vue";


export default defineComponent({
  name: 'ViewConversation',
  data(){
    return {
      currentMessage: ''
    }
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const objectId: any = route.params.conversationId;
    const loading = ref(true);
    const isMine = (msg: Parse.Object) => msg.get("author").id == store.getters["auth/myId"];
    store.commit("startLoading");
    const loaders = [
        store.dispatch("inbox/loadMessages", objectId)
    ];
    if (!store.getters.objectsMap[objectId]) {
        loaders.push(store.dispatch("fetchModel", {
            className: "Conversation",
            objectId,
            includes: ["participants", "team"]
        }));
    }
    Promise.all(loaders).then(()=>{
        store.commit("doneLoading");
        loading.value = false;
    })
    return {
      store, isMine, smartTimestamp,
      conversation: computed(() => store.getters.objectsMap[objectId]),
      messages: computed(() => (store.getters["inbox/messages"][objectId]||[]).map((x:  string) => store.getters.objectsMap[x])),
      clsForMsg(msg: Parse.Object) {
        return isMine(msg) ? "entry mine" : "entry";
      },
      loading,
    }
  },
  methods: {
    sendMessage() {
      if (!this.currentMessage) { return }
      this.store.dispatch("inbox/sendMessage", {
        conversationId: this.conversation.id, text: this.currentMessage
      });
      this.currentMessage = '';
    },
  },
  components: {
    IonContent, IonPage, IonSpinner, IonFooter, IonButtons, IonBackButton, IonHeader,
    IonItem,
    InlineText, ConversationEntry,
  }
});
</script>
<style scoped>
main {
  display: flex;
  flex-direction: column-reverse;
}

.entry {
  display: flex;
  flex-direction: column;
  margin: 0.25em;
  align-self: start;
}

.message {
  padding: 0.5rem 1rem;
  background: var(--ion-color-light);
}

.entry .message {
  border-radius: 1rem 1rem 1rem 0;
}

.entry.mine {
  text-align: right;
  align-self: flex-end;
}

.entry.mine .message{
  border-radius: 1rem 1rem 0 1rem;
}

.meta {
  font-size:0.75em;
  color: var(--ion-color-medium);
}
</style>