<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
          {{conversation.id}}
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../stores/';
import { useRoute } from 'vue-router';


export default defineComponent({
  name: 'ViewConversation',
  setup() {
    const store = useStore();
    const route = useRoute();
    const objectId: any = route.params.conversationId;
    const loading = ref(true);
    store.commit("startLoading");
    const loaders = [
        store.dispatch("inbox/loadMessages", {
            "__type": "Pointer",
            "className": "Conversation",
            objectId,
        })
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
      conversation: computed(() => store.getters.objectsMap[objectId]),
      messages: computed(() => store.getters["inbox/messages"][objectId]),
      loading,
    }
  },
  components: {
    IonContent, IonPage,
  }
});
</script>