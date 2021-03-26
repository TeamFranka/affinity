<template>
  <login
    with-closer
    :signup-extra="signUpExtra"
    @close="closeModal"
    @user-updated="userUpdated($event)"
  />
</template>
<script lang="ts">
import { modalController } from "@ionic/vue";
import Login from "./login.vue";
import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LoginModal",
  components: {
    Login,
  },
  setup() {
    const store = useStore();
    return {
      signUpExtra: computed(() => ({
        signUpForTeams: [store.getters.defaultTeamId],
      })),
      closeModal: () => modalController.dismiss(),
      userUpdated: (newUser: any) => store.dispatch("auth/loggedIn", newUser),
    };
  },
});
</script>
