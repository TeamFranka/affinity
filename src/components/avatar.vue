<template>
  <ion-avatar  v-if="profile.avatar">
    <img v-bind:src="profile.avatar"  />
  </ion-avatar>
  <span class="letter-avatar" v-if="!profile.avatar" :style="style">{{letter}}</span>
</template>


<script lang="ts">
import {
  IonAvatar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Avatar',
  props: {
    profile: Object
  },
  computed: {
    letter(): string {
      const text = (this.profile && (this.profile.name || this.profile.username)) || "";
      if (text.length > 0) {
        return text[0].toUpperCase()
      }
      return "O"
    },
    style(): string {
      const text = (this.profile && (this.profile.name || this.profile.username)) || "";
      const vals = [0, 0, 0];
      let curIdx = 0;
      for (let i = 0; i < text.length; i++) {
        vals[curIdx] += text.charCodeAt(i);
        curIdx += 1;
        if (curIdx == vals.length) {
          curIdx = 0
        }
      }
      const r = vals[0] % 255;
      const g = vals[1] % 255;
      const b = vals[2] % 255;
      const foreground = (r + g + b) < 385 ? "white" : "#999";

      return "background-color:rgb(" + r + "," + g + "," + b + "); color:" + foreground;
    }
  },
  components: {
    IonAvatar,
  }
});
</script>
<style scoped>
.letter-avatar {
  display: inline-block;
  width: 2rem;
  border-radius: 100%;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  margin: 0 0.2rem;
  font-size: 1.25rem;
}
</style>