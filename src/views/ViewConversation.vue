<template>
  <ion-page>
    <ion-header>
      <ion-buttons slot="start">
        <ion-back-button />
      </ion-buttons>
      <ion-item>
        <conversation-entry v-if="!loading" :convo="conversation" />
      </ion-item>
    </ion-header>
    <ion-content>
      <div v-for="m in messages" :key="m.id">
        {{m.get("author").get("name")}}: {{m.get("text")}}
      </div>
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
import InlineText from "@/components/inline-text";
import {
  IonPage, IonContent, IonSpinner, IonFooter, IonButtons, IonBackButton,
  IonHeader, IonItem, IonTitle,
} from '@ionic/vue';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../stores/';
import { useRoute } from 'vue-router';
import ConversationEntry from "@/components/conversation-entry.vue";


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
      store,
      conversation: computed(() => store.getters.objectsMap[objectId]),
      messages: computed(() => (store.getters["inbox/messages"][objectId]||[]).map((x:  string) => store.getters.objectsMap[x])),
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
</style>