<template>
  <login
    with-closer
    @close="closeModal"
    @user-updated="userUpdated($event)"
  />
</template>
<script lang="ts">
import {
  modalController,
} from "@ionic/vue";
import Login from "./login.vue";
import { useStore } from '../stores/';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginModal',
  components: {
    Login,
  },
  setup(){
    const store = useStore();
    return {
      closeModal: () => modalController.dismiss(),
      userUpdated: (newUser: any) => store.dispatch("auth/loggedIn", newUser)
    }
  }
});
</script>