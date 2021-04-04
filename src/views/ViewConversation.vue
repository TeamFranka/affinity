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
        <message-entry :message="m" v-for="m in messages" :key="m.objectId" />
      </main>
      <ion-spinner v-if="loading" />
    </ion-content>
    <ion-footer class="ion-no-padding">
      <ion-item class="ion-no-padding">
        <ion-button fill="clear" slot="start" @click="openNewPostModal">
          <ion-icon :icon="expandOutline"/>
        </ion-button>
        <ion-input
          :placeholder="$t('conversation.placeholder.writeMessage')"
          :value="currentMessage"
          @ionChange="setMessage($event.detail.value)"
        />
        <ion-button
          fill="clear"
          slot="end"
          :disabled="!canSubmit"
          @click="sendMessage"
        ><ion-icon :icon="paperPlaneOutline"/></ion-button>

      </ion-item>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
//import InlineText from "../components/inline-text.vue";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonFooter,
  IonButton,
  IonButtons,
  IonBackButton,
  IonHeader,
  IonItem,
  IonInput,
  IonIcon,
  modalController,
} from "@ionic/vue";
import {
  paperPlaneOutline,
  expandOutline
  } from 'ionicons/icons';
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../stores/";
import { useRoute } from "vue-router";
import NewPostModal from "@/components/new-post-modal.vue";
import ConversationEntry from "@/components/conversation-entry.vue";
import MessageEntry from "@/components/message-entry.vue";

export default defineComponent({
  name: "ViewConversation",
  setup() {
    const store = useStore();
    const route = useRoute();
    const objectId: any = route.params.conversationId;
    const loading = ref(true);
    store.commit("startLoading");
    const loaders = [store.dispatch("inbox/loadMessages", objectId)];
    if (!store.getters.objectsMap[objectId]) {
      loaders.push(
        store.dispatch("fetchModel", {
          className: "Conversation",
          objectId,
          includes: ["participants", "team"],
        })
      );
    }
    Promise.all(loaders).then(() => {
      store.commit("doneLoading");
      loading.value = false;
    });
    return {
      store,
      objectsCount: computed(() => store.state.draft.objects.length),
      currentMessage: computed(() => store.state.draft.text),
      setMessage: (x: string) => store.dispatch("draft/updateText", x),
      canSubmit: computed(() => store.getters["draft/canSubmit"]),
      conversation: computed(() => store.getters.objectsMap[objectId]),
      messages: computed(() =>
        (store.getters["inbox/messages"][objectId] || []).map(
          (x: string) => store.getters.objectsMap[x]
        )
      ),
      sendMessage: () => store.dispatch("draft/sendAsMessage", objectId),
      loading,
      paperPlaneOutline,
      expandOutline,
    };
  },
  computed: {
    team(): any {
      const convo = this.conversation;
      return this.store.getters.objectsMap[convo.team.objectId]
    }
  },
  methods: {
    async openNewPostModal () {
      const popover = await modalController
        .create({
          component: NewPostModal,
           cssClass:'modalCss',
           componentProps: {
            teams: [this.team],
            canChangeVisiblity: false,
            title: this.$t("conversation.newMessage")
          },
        });
      popover.present();
      const result = await popover.onDidDismiss();
      if (result.data && result.data.action == "submit") {
        await this.sendMessage();
      }
    },
  },
  components: {
    IonContent,
    IonPage,
    IonSpinner,
    IonFooter,
    IonButton,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonItem,
    IonInput,
    IonIcon,
    // InlineText,
    ConversationEntry,
    MessageEntry,
  },
});
</script>
<style scoped>
main {
  display: flex;
  flex-direction: column-reverse;
}
</style>
