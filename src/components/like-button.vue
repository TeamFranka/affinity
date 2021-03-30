<template>
  <span @click="toggleLike()" :disabled="disabled">
    <ion-icon
      :icon="hasLiked ? hasLikedIcon : likeIcon"
      :color="hasLiked ? 'danger' : ''"
      :size="iconSize"
    />
    <ion-label>{{ counter }}</ion-label>
  </span>
</template>
<script>
import { IonLabel, IonIcon } from "@ionic/vue";
import { heartOutline, heart } from "ionicons/icons";
import { defineComponent } from "vue";
import { Parse } from "../config/Consts";
import { useStore } from "../stores/";

export default defineComponent({
  name: "LikeButton",
  props: {
    iconSize: {
      type: String,
      required: true,
      default: "small",
    },
    counter: {
      type: Number,
      required: true,
    },
    hasLiked: {
      type: Boolean,
    },
    pointer: {
      type: Parse.Pointer,
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
    };
  },
  setup() {
    const store = useStore();
    return {
      store,
      likeIcon: heartOutline,
      hasLikedIcon: heart,
    };
  },
  methods: {
    toggleLike() {
      if (this.hasLiked) {
        this.store.dispatch("auth/unlike", Object.assign({}, this.pointer));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.pointer));
      }
    },
  },
  components: {
    IonLabel,
    IonIcon,
  },
});
</script>


