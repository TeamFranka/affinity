<template>
  <ion-row ref="doubleTapRef">
    <ion-col size="1.33">
      <div class="authorAvatar" >
        <avatar :profile="author"/>
      </div>
    </ion-col>
    <ion-col size="10" style="padding-top: 0px;">
      <ion-row size="10">
        <ion-col class="authorTitle"> {{authorName}} 
        </ion-col>
        <ion-col size="0.5" style="padding: 0">
          <div>/
          </div>
        </ion-col>
        <ion-chip size="small" style="margin: 1px"> 
          <ion-label>Group Name
          </ion-label>
        </ion-chip>
      </ion-row>
      <ion-row>
        <ion-note class="since" color="medium">{{since}}
        </ion-note>
      </ion-row>
      <div class="authorText">
        {{ text }}
      </div>
      <div style="padding-bottom: 10px">
        <ion-chip @click="showInput = !showInput" color="medium">
          <ion-icon :icon="showInput ? commentsIconB : commentsIcon" :color="showInput ? 'primary' : '' " size="small" />
          <ion-label>{{comment.commentsCount}}</ion-label>
        </ion-chip>
        <share-button
          :link="fullLink"
          :pointer="pointer"
          :counter="object.sharesCount || 0"
        />
        <ion-chip @click="toggleLike" color="medium">
          <ion-icon :icon="hasLiked  ? hasLikedIcon : likeIcon" :color="hasLiked ? 'danger' : 'medium' " :size="iconSize" />
          <ion-label>{{comment.likesCount }}</ion-label>
        </ion-chip>
        <reactions :item="object" />
        <slot name="extraButtons" />
        <!-- <ion-chip v-for="r in reactions" :key="r.key" @click="unreact(r.key)" color="medium">
          <ion-label>{{r.key}}</ion-label>
          <ion-label>{{r.count}}</ion-label>
        </ion-chip> -->
        <!-- <ion-chip color="medium" size="small">
          <ion-button @click="selectEmoji" v-if="canReact" fill="clear" size="small">
            <ion-icon :icon="plusIcon" size="small"/>
          </ion-button>
        </ion-chip> -->
      </div>
    
    <!-- </ion-col>
    <ion-col offset="1" size="11" style="margin-left: 80px"> -->
    <div v-if="showInput">
        <inline-text style="padding-top: 0px" 
          v-if="showInput"
          :value="draft"
          :canSubmit="!!(draft && draft.length >= 3)"
          placeholder="comment here"
          @submit="submitComment()"
          @changed="setDraft($event)"
        />
        <ion-grid>
          <comment
            v-for="c in children"
            :children="c.comments"
            :key="c.objectId"
            :commentId="c.objectId"
            :object="object"
          />
        </ion-grid>
      </div>
    </ion-col>
  </ion-row>
</template>


<script lang="ts">
import {
  IonCol, IonRow, IonLabel,
  IonIcon, IonNote, IonChip,
} from '@ionic/vue';
import {
  chatbubbles, chatbubblesOutline, heart, heartOutline, addOutline, arrowRedoOutline, arrowUndoOutline
} from 'ionicons/icons';
// import { createGesture } from "@ionic/core";

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { dayjs } from "../config/Consts";
import { Model } from '@/utils/model';
import InlineText from './inline-text.vue';
import Reactions from "./reactions.vue";

export default defineComponent({
  name: 'Comment',
  props: {
    object:  {
      type: Object,
      required: true
    },
    commentId: {
      type: String,
      required: true
    },
    inset: Boolean,
    children: {
      type: Array
    },
    startCommentsOpen: Boolean,
  },
  data() {
    return {
      showInput: false,
      // showComments: props.startCommentsOpen,
    }
  },
  setup(props) {
    const store = useStore();
    return {
      comment: computed(() => store.getters.objectsMap[props.commentId]),
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon: chatbubblesOutline,
      commentsIconB: chatbubbles,
      teamSplitterIcon: arrowRedoOutline,
      likeIcon: heartOutline,
      hasLikedIcon: heart,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline,
      replyIcon: arrowUndoOutline,
    }
  },
  computed: {
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.comment.likedBy || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    author(): Model {
      return this.objs[this.comment.author.objectId]
    },
    since(): string {
      return dayjs(this.comment.createdAt).fromNow()
    },
    text(): string {
        return this.comment.text || ""
    },
    draft(): string {
      const d = this.store.state.comments.drafts[this.object.objectId];
      if (d) {
        return d[this.commentId]
      }
      return ""
    },
    objects(): any {
      return (this.comment.attachments || []).map(
            (o: Model) => this.objs[o.objectId])
    },
    likedColor(): string {
      return this.hasLiked ? "danger" : "light"
    },
    authorName(): string {
      const author = this.author;
      return author.name || author.username
    },
    reactions(): Array<any> {
      return Object.keys(this.comment.reactions || {}).map((key) => {
        const reactors = this.comment.reactions[key];
        return {
          key,
          color: reactors.indexOf(this.store.getters["auth/myId"]) === -1 ? "light" : "dark",
          count: reactors.length
        }
      })
    }
  },
  methods: {
    setDraft(text: string) {
      console.log("setting draft", text);
      this.store.commit("comments/setDraft", {
        objectId: this.object.objectId,
        replyTo: this.commentId,
        text
      });
    },
    submitComment(){
      this.store.dispatch("comments/submitDraft", {
        ptr: this.object,
        replyTo: this.comment.toPointer(),
      });
    },
    like() {
      this.store.dispatch("auth/like", Object.assign({}, this.comment.toPointer()));
    },
    toggleLike() {
      if (this.hasLiked){
        this.store.dispatch("auth/unlike", Object.assign({}, this.comment.toPointer()));
      } else {
        this.store.dispatch("auth/like", Object.assign({}, this.comment.toPointer()));
      }
    },
    react(reaction: string) {
      this.store.dispatch("auth/react", Object.assign({reaction}, this.comment.toPointer()));
    },
    unreact(reaction: string) {
      this.store.dispatch("auth/unreact", Object.assign({reaction}, this.comment.toPointer()));
    },
  },
  components: {
    IonRow, IonChip, IonLabel, IonCol, InlineText, IonNote, Avatar, Reactions
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
.authorAvatar {
  padding-left: 6px;
}
.authorTitle {
  /* font-size:3vw; */
  color: #428cff;
  font-size: 1.2em;
  padding-top: 0px;
  padding-left: 4px;
  padding-right: 10px;
  padding-bottom: 0px; 
}

.authorText {
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 4px;
}
.since {
  /* font-size:1.5vw; */
  padding-left: 4px;
  font-size: 0.8em;
}
[size="small"]{
  height: 5px;
}
</style>