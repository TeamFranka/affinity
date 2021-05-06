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
            :can-edit="false"
            :showMenu="false"
            :showQr="false"
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
import { defineComponent } from "vue";
import { Model } from "@/utils/model";
import { useStore } from "../stores/";
import { absoluteUrl } from "@/utils/url";

export default defineComponent({
  name: "ViewUser",
  data() {
    return {
      selectedSegment: "posts",
      loading: true,
    }
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData",
  },
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  computed: {
    user(): Model {
      const objectId: any = this.$route.params.userId;
      return this.store.getters.objectsMap[objectId]
    },
    segments(): any[] {
      return [
        {value: "posts", title: this.$t("profile.tabs.posts")},
        {value: "activities", title: this.$t("profile.tabs.activities")},
      ]
    },
    fullLink(): string {
      return absoluteUrl(this.$router, {
        name: "ViewUser",
        params: { userid: this.user.objectId, },
      });
    },
  },
  methods: {
    async fetchData() {
      const objectId: any = this.$route.params.userId;
      this.loading = true;
      if (!objectId) { return }
      if (!this.store.getters.objectsMap[objectId]) {
        await this.store.dispatch("fetchModel", {
          className: "User",
          objectId,
        })
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData();
  },
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
