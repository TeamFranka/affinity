<template>
  <div class="ion-padding-top ion-padding-start">
    <ion-chip
      @click="toggleComments()"
      outline
      :color="showComments ? 'dark' : 'light'"
    >
      <ion-icon :icon="commentsIcon" size="small" />
      <ion-label>{{ object.commentsCount }}</ion-label>
    </ion-chip>
    <ion-chip outline color="light">
      <share-button
        :link="fullLink"
        :pointer="pointer"
        :counter="object.sharesCount || 0"
      />
    </ion-chip>
    <ion-chip outline :color="likedColor">
      <like-button
        :has-liked="hasLiked"
        :pointer="pointer"
        :counter="object.likesCount || 0"
      />
    </ion-chip>
    <reactions :item="object" />
    <slot name="extraButtons" />
  </div>
  <div v-if="showComments">
    <ion-spinner v-if="commentsLoading" />
    <inline-text
      :value="draft"
      :canSubmit="!!(draft && draft.length >= 3)"
      placeholder="comment here"
      @submit="submitComment()"
      @changed="setDraft($event)"
    />
    <ion-grid>
      <comment
        v-for="c in comments"
        :commentId="c.objectId"
        :key="c.oobjectId"
        :children="c.comments"
        :object="pointer"
      />
    </ion-grid>
  </div>
</template>

<script lang="ts">
import { IonLabel, IonSpinner, IonIcon, IonChip, IonGrid } from "@ionic/vue";
import {
  chatbubblesOutline,
  addOutline,
  arrowRedoOutline,
  heartOutline,
} from "ionicons/icons";
import InlineText from "./inline-text.vue";
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import Reactions from "./reactions.vue";
import Comment from "./comment.vue";
import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";
import { Model } from "@/utils/model";

export default defineComponent({
  name: "Activity",
  props: {
    object: {
      type: Model,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    startCommentsOpen: Boolean,
  },
  data(props) {
    return {
      showComments: props.startCommentsOpen,
      comment: "",
    };
  },
  setup() {
    const store = useStore();
    return {
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon: chatbubblesOutline,
      teamSplitterIcon: arrowRedoOutline,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline,
      likeIcon: heartOutline,
    };
  },
  computed: {
    fullLink(): string {
      return process.env.BASE_URL + this.link;
    },
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (
        (this.object.likedBy || []).indexOf(this.store.getters["auth/myId"]) !==
        -1
      );
    },
    pointer(): Parse.Pointer {
      return this.object.toPointer();
    },
    draft(): string {
      const d = this.store.state.comments.drafts[this.object.objectId];
      if (d) {
        return d[""];
      }
      return "";
    },
    commentsLoading(): boolean {
      const s = this.store.state.comments.comments[this.object.objectId];
      if (s) {
        return s.loading;
      }
      return false;
    },
    comments(): Array<any> {
      const s = this.store.state.comments.comments[this.object.objectId];
      if (s) {
        return s.comments;
      }
      return [];
    },
    likedColor(): string {
      return this.hasLiked ? "danger" : "light";
    },
  },
  methods: {
    async toggleComments() {
      if (this.showComments) {
        this.showComments = false;
        return;
      }
      await this.store.dispatch(
        "comments/loadComments",
        this.object.toPointer()
      );
      this.showComments = true;
    },
    setDraft(text: string) {
      this.store.commit("comments/setDraft", {
        objectId: this.object.objectId,
        text,
      });
    },
    submitComment() {
      const text = this.comment;
      console.log("submitting", text);
      this.store.dispatch("comments/submitDraft", {
        ptr: this.object.toPointer(),
        text,
      });
    },
  },
  components: {
    IonChip,
    IonLabel,
    IonSpinner,
    Comment,
    IonIcon,
    IonGrid,
    InlineText,
    ShareButton,
    Reactions,
    LikeButton,
  },
});
</script>
<style scoped>
.like-icon {
  position: absolute;
  transform-origin: bottom;
  opacity: 0;
  width: 3em;
  height: 3em;
  color: #900;
  z-index: 1;
}
</style>
<style scoped lang="css">
  ion-chip span {
    margin-top: 2px;
    padding-right: 6px !important;
  }
  ion-chip ion-label {
    position: absolute;
    top: 0;
    margin-top: 9px;
  }
</style>
