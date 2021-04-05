<template>
  <ion-page>
    <ion-content>
      <div class="wrap">
        <div class="centralizeTotal" v-if="loading">
          <ion-spinner />
        </div>
        <template v-else>
          <profile-card
            :profile="user"
            :can-edit="canEdit"
            :showMenu="true"
            :showQr="true"
            :seletedSegment="selectedSegment"
            :segments="segments"
          >
            <template v-slot:menu>
              <!-- FIXME: teams should go here -->
            </template>
          </profile-card>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ProfileCard from "@/components/profile-card.vue";
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../stores/";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ViewUser",
  data() {
    return {
      selectedSegment: "posts"
    }
  },
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
      canEdit:  computed(() => store.getters["auth/userId"] == objectId),
      loading,
    };
  },
  computed: {
    segments(): any[] {
      return [
        {value: "posts", title: this.$t("profile.tabs.posts")},
        {value: "activities", title: this.$t("profile.tabs.activities")},
      ]
    }
  },
  methods: {},
  components: {
    ProfileCard,
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
