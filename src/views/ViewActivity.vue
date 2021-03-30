<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <activity
          v-if="!loading"
          startCommentsOpen
          :activity="activity"
          :key="activity.objectId"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../stores/";
import { useRoute } from "vue-router";
import Activity from "../components/activity.vue";

export default defineComponent({
  name: "ViewActivity",
  setup() {
    const store = useStore();
    const route = useRoute();
    const objectId: any = route.params.activityId;
    const loading = ref(true);
    const loaders = [
      store.dispatch("comments/loadComments", {
        __type: "Pointer",
        className: "Activity",
        objectId,
      }),
    ];
    if (!store.getters.objectsMap[objectId]) {
      loaders.push(
        store.dispatch("fetchModel", {
          className: "Activity",
          objectId,
          includes: ["author", "objects"],
        })
      );
    }
    Promise.all(loaders).then(() => {
      store.commit("doneLoading");
      loading.value = false;
    });
    return {
      activity: computed(() => store.getters.objectsMap[objectId]),
      loading,
    };
  },
  components: {
    IonContent,
    IonPage,
    Activity,
  },
});
</script>
