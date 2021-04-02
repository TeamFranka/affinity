<template>
  <ion-page>
    <ion-content>
      <ion-spinner v-if="loading" />
      <template v-else>
        <div class="ion-text-center">
          <div class="profile-img">
            <avatar :profile="user" />
          </div>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Avatar from "../components/avatar.vue";
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../stores/";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ViewUser",
  setup() {
    const store = useStore();
    const route = useRoute();
    const objectId: any = route.params.userId;
    const loading = ref(true);
    if (!store.getters.objectsMap[objectId]) {
      store
        .dispatch("fetchModel", {
          className: "User",
          objectId,
        })
        .then(() => {
          store.commit("doneLoading");
          loading.value = false;
        });
    } else {
      loading.value = false;
    }
    return {
      user: computed(() => store.getters.objectsMap[objectId]),
      loading,
    };
  },
  methods: {},
  components: {
    Avatar,
    IonPage,
    IonContent,
    IonSpinner,
  },
});
</script>
<style scoped>
ion-chip ion-icon {
  margin: 0;
}
.profile-img {
  width: 50%;
}
</style>
