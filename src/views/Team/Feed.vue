<template>
  <div>
    <activity
      v-for="activity in feed"
      :activity="activity"
      :key="activity.objectId"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/stores/";
import { Model } from "@/utils/model";
import Activity from "@/components/activity.vue";


export default defineComponent({
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  computed: {
    team(): Model {
      const slug: any = this.$route.params.teamSlug;
      return this.store.getters.objectsMap[
        this.store.getters.teamsBySlug[slug]
      ];
    },
    feed(): Model[] {
      const teamId = this.team.id;
      return this.store.getters["feed/latestPosts"]
        .filter((post: any) => post.team.objectId == teamId)
    }
  },
  components: {
    Activity
  }
})
</script>
<style scoped>

</style>
