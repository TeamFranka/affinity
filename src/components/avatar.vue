<template>
  <span class="profile-wrap" :style="iconStyles">
    <ion-avatar v-if="avatarUrl">
      <img v-bind:src="avatarUrl" />
    </ion-avatar>
    <span class="letter-avatar" v-if="!avatarUrl" :style="style">
      <svg viewBox="0 0 100 100">
        <text text-anchor="middle" y="75" x="50" font-size="60">
          {{ letter }}
        </text>
      </svg>
    </span>
  </span>
  <span v-if="withName" class="spanWithName">{{shownName}}</span>
</template>

<script lang="ts">
import { IonAvatar } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Avatar",
  props: {
    profile: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "5em",
    },
    name: String,
    withName: Boolean,
  },
  components: {
    IonAvatar,
  },
  computed: {
    avatarUrl(): string | null {
      const avatar = this.profile && this.profile.avatar;
      if (avatar) {
        return avatar.url;
      }
      return null;
    },
    shownName(): string {
      return (
        this.name ||
        this.profile.name ||
        this.profile.username ||
        this.profile.slug ||
        this.profile.objectId ||
        ""
      );
    },
    iconStyles(): any {
      if (this.size) {
        return {
          height: this.size,
          width: this.size,
          "padding-bottom": "unset",
        };
      }
      return {};
    },
    letter(): string {
      const text = this.shownName;
      if (text.length > 0) {
        return text[0].toUpperCase();
      }
      return "👤";
    },
    style(): string {
      const text = this.shownName;
      const vals = [0, 0, 0];
      let curIdx = 0;
      for (let i = 0; i < text.length; i++) {
        vals[curIdx] += text.charCodeAt(i);
        curIdx += 1;
        if (curIdx == vals.length) {
          curIdx = 0;
        }
      }
      const r = vals[0] % 255;
      const g = vals[1] % 255;
      const b = vals[2] % 255;
      const foreground = r + g + b < 385 ? "white" : "#999";

      return (
        "background-color:rgb(" +
        r +
        "," +
        g +
        "," +
        b +
        "); color:" +
        foreground
      );
    },
  },
});
</script>
<style scoped>
.profile-wrap {
  position: relative;
  display: inline-block;
}
.letter-avatar {
  border-radius: 100%;
  display: inline-block;
  border: 2px solid #aaa;
  width: 100%;
  height: 100%;
}
ion-avatar {
  --border-radius: 100%;
  display: inline-block;
  border: 2px solid #aaa;
  width: 100%;
  height: 100%;
}
.spanWithName{
  margin-left: 5px;
}
</style>
