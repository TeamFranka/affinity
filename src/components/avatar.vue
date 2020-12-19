<template>
<div class="profile-wrap">
  <ion-avatar v-if="avatarUrl">
    <img v-bind:src="avatarUrl"  />
  </ion-avatar>
  <span class="letter-avatar" v-if="!avatarUrl" :style="style">
    <svg viewBox="0 0 100 100">
      <text text-anchor="middle" y="75" x="50" font-size="60">{{letter}}</text>
    </svg>
  </span>
</div>
  <span v-if="withName">{{name}}</span>
</template>


<script lang="ts">
import {
  IonAvatar,
} from '@ionic/vue';
import Parse from "parse";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Avatar',
  props: {
    profile: {
      type: Parse.Object,
      required: true
    },
    withName: Boolean,
  },
  components: {
    IonAvatar,
  },
  computed: {
    avatarUrl(): string | null {
      const avatar = this.profile && this.profile.get("avatar");
      if (avatar) {
        return avatar.url()
      }
      return null;
    },
    name(): string {
      return this.profile.get("name") || this.profile.get("username") || this.profile.get("slug") || this.profile.id;
    },
    letter(): string {
      const text = (this.profile && (this.profile.get("name") || this.profile.get("username"))) || "";
      if (text.length > 0) {
        return text[0].toUpperCase()
      }
      return "👤"
    },
    style(): string {
      const text = (this.profile && (this.profile.get("name") || this.profile.get("username") || this.profile.get("id") )) || "";
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
});
</script>
<style scoped>
.letter-avatar, ion-avatar {
  display: inline-block;
  border-radius: 100%;
  border: 2px solid #aaa;
}
</style>