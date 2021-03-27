<template>
  <div v-if="brief" class="ion-padding-horizontal">
    {{ text }}
    – <avatar size="1.25rem" :profile="author" with-name />&nbsp;<ion-note color="medium">{{ since }}</ion-note>
  </div>
  <ion-row v-else>
    <ion-col size="1" class="text-center">
      <avatar size="2.5rem" :profile="author" />
    </ion-col>
    <ion-col size="10">
      <div>
        {{ authorName }} <ion-note color="medium">{{ since }}</ion-note>
      </div>
      <div>
        {{ text }}
      </div>
      <div>
        <ion-chip @click="showInput = !showInput" outline :color="showInput? 'medium' : 'light'">
          <ion-icon :icon="replyIcon" size="small" />
        </ion-chip>

        <ion-chip @click="toggleLike" outline size="small" :color="likedColor">
          <ion-icon :icon="likeIcon" size="small" />
          <ion-label>{{ comment.likesCount }}</ion-label>
        </ion-chip>
        <ion-chip
          outline
          v-for="r in reactions"
          :key="r.key"
          @click="unreact(r.key)"
        >
          <ion-label>{{ r.key }}</ion-label>
          <ion-label>{{ r.count }}</ion-label>
        </ion-chip>
        <ion-chip outline color="light">
          <ion-icon :icon="plusIcon" size="small" />
        </ion-chip>
      </div>
    </ion-col>
    <ion-col
      offset="1"
      size="11"
      class="sub-comments-box"
      v-if="showInput || children.length > 0"
    >
      <comment
        v-for="c in children"
        brief
        :children="c.comments"
        :key="c.objectId"
        :commentId="c.objectId"
        :object="object"
      />
      <inline-text
        v-if="showInput"
        :value="draft"
        :canSubmit="!!(draft && draft.length >= 3)"
        :placeholder="$t('comment.placeholder')"
        @submit="submitComment()"
        @changed="setDraft($event)"
      />
    </ion-col>
  </ion-row>
</template>

<script lang="ts">
import {
  IonCol,
  IonRow,
  IonLabel,
  IonIcon,
  IonNote,
  IonChip,
} from "@ionic/vue";
import {
  chatbubblesOutline,
  heartOutline,
  addOutline,
  arrowRedoOutline,
  arrowUndoOutline,
} from "ionicons/icons";

import Avatar from "./avatar.vue";
import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";
import { dayjs } from "../config/Consts";
import { Model } from "@/utils/model";
import InlineText from "./inline-text.vue";

export default defineComponent({
  name: "Comment",
  props: {
    object: {
      type: Object,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
    brief: Boolean,
    children: {
      type: Array,
    },
  },
  data() {
    return {
      showInput: false,
    };
  },
  setup(props) {
    const store = useStore();
    return {
      comment: computed(() => store.getters.objectsMap[props.commentId]),
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon: chatbubblesOutline,
      teamSplitterIcon: arrowRedoOutline,
      likeIcon: heartOutline,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline,
      replyIcon: arrowUndoOutline,
    };
  },
  computed: {
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (
        (this.comment.likedBy || []).indexOf(
          this.store.getters["auth/myId"]
        ) !== -1
      );
    },
    author(): Model {
      return this.objs[this.comment.author.objectId];
    },
    since(): string {
      return dayjs(this.comment.createdAt).fromNow();
    },
    text(): string {
      return this.comment.text || "";
    },
    draft(): string {
      const d = this.store.state.comments.drafts[this.object.objectId];
      if (d) {
        return d[this.commentId];
      }
      return "";
    },
    objects(): any {
      return (this.comment.attachments || []).map(
        (o: Model) => this.objs[o.objectId]
      );
    },
    likedColor(): string {
      return this.hasLiked ? "danger" : "light";
    },
    authorName(): string {
      const author = this.author;
      return author.name || author.username;
    },
    reactions(): Array<any> {
      return Object.keys(this.comment.reactions || {}).map((key) => {
        const reactors = this.comment.reactions[key];
        return {
          key,
          color:
            reactors.indexOf(this.store.getters["auth/myId"]) === -1
              ? "light"
              : "dark",
          count: reactors.length,
        };
      });
    },
  },
  methods: {
    setDraft(text: string) {
      this.store.commit("comments/setDraft", {
        objectId: this.object.objectId,
        replyTo: this.commentId,
        text,
      });
    },
    submitComment() {
      this.store.dispatch("comments/submitDraft", {
        ptr: this.object,
        replyTo: this.comment.toPointer(),
      });
    },
    like() {
      this.store.dispatch(
        "auth/like",
        Object.assign({}, this.comment.toPointer())
      );
    },
    toggleLike() {
      if (this.hasLiked) {
        this.store.dispatch(
          "auth/unlike",
          Object.assign({}, this.comment.toPointer())
        );
      } else {
        this.store.dispatch(
          "auth/like",
          Object.assign({}, this.comment.toPointer())
        );
      }
    },
    react(reaction: string) {
      this.store.dispatch(
        "auth/react",
        Object.assign({ reaction }, this.comment.toPointer())
      );
    },
    unreact(reaction: string) {
      this.store.dispatch(
        "auth/unreact",
        Object.assign({ reaction }, this.comment.toPointer())
      );
    },
  },
  components: {
    IonRow,
    IonChip,
    IonLabel,
    IonCol,
    InlineText,
    IonIcon,
    IonNote,
    Avatar,
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
.sub-comments-box {
  border-left: 2px solid var(--ion-color-light);
}
</style>
