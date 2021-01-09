<template>
<login @user-updated="userUpdated($event)" />
</template>
<script lang="ts">
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
        userUpdated: (newUser: any) => store.dispatch("auth/loggedIn", newUser)
    }
  }
});
</script>