<template>
    <ion-avatar>
        <img v-bind:src="user.avatar" />
    </ion-avatar>
</template>


<script lang="ts">
import {
  IonAvatar,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Parse from 'parse';

export default defineComponent({
  name: 'UserIcon',
  props: {
      user: Object
    },
  components: {
    IonAvatar
  }
});
</script>