<template>
  <ion-grid>
    <ion-row ref="doubleTapRef">
      <ion-col size="10em">
        <div classname="authorAvatar">
          <avatar :profile="author"/>
        </div>
      </ion-col>
      <ion-col>
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
        
        <!-- <share-button
          :link="nix"
          :pointer="pointer"
          :counter="comment.sharesCount || 0"
        />
        <like-button
          :has-liked="hasLiked"
          :pointer="pointer"
          :counter="comment.likesCount || 0"
          /> -->

          <!--
          <ion-chip @click="toggleLike" outline size="small" :color="likedColor">
            <ion-icon :icon="likeIcon" size="small"/>
            <ion-label>{{comment.likesCount }}</ion-label>
          </ion-chip>
          <ion-chip outline v-for="r in reactions" :key="r.key" @click="unreact(r.key)">
            <ion-label>{{r.key}}</ion-label>
            <ion-label>{{r.count}}</ion-label>
          </ion-chip>
          <ion-chip outline color="light">
            <ion-icon :icon="plusIcon" size="small"/>
          </ion-chip>
         -->
      </ion-col>
      <ion-col size="1">
        <ion-chip @click="showInput = !showInput" outline color="light">
          <ion-icon :icon="replyIcon" size="small"/>
        </ion-chip>
      </ion-col>
      <ion-col offset="1" size="11">
        <inline-text
          v-if="showInput"
          :value="draft"
          :canSubmit="!!(draft && draft.length >= 3)"
          placeholder="comment here"
          @submit="submitComment()"
          @changed="setDraft($event)"
        />
      </ion-col>

       <!--
        <comment
          v-for="c in children"
          :children="c.comments"
          :key="c.objectId"
          :commentId="c.objectId"
          :object="object"
        />
      </ion-col> -->
    </ion-row>
  </ion-grid>
</template>


<script lang="ts">
import {
  IonCol, IonRow, IonLabel,
  IonIcon, IonNote, IonChip,
} from '@ionic/vue';
import {
  chatbubblesOutline, heartOutline, addOutline, arrowRedoOutline, arrowUndoOutline
} from 'ionicons/icons';
// import { createGesture } from "@ionic/core";

import Avatar from "./avatar.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { dayjs } from "../config/Consts";
import { Model } from '@/utils/model';
import InteractionBar from "./interaction-bar.vue";

import InlineText from './inline-text.vue';
import LikeButton from './like-button.vue';
import ShareButton from './share-button.vue';

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
  },
  data() {
    return {
        showInput: false,
    }
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
    }
  },
  computed: {
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.comment.likedBy || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    // isMember(): string {
    //   return this
    // }
    pointer(): Parse.Pointer {
      return this.comment.toPointer()
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
    // toggleLike() {
    //   if (this.hasLiked){
    //     this.store.dispatch("auth/unlike", Object.assign({}, this.comment.toPointer()));
    //   } else {
    //     this.store.dispatch("auth/like", Object.assign({}, this.comment.toPointer()));
    //   }
    // },
    react(reaction: string) {
      this.store.dispatch("auth/react", Object.assign({reaction}, this.comment.toPointer()));
    },
    unreact(reaction: string) {
      this.store.dispatch("auth/unreact", Object.assign({reaction}, this.comment.toPointer()));
    },
  },
  components: {
    IonRow, IonChip, IonLabel, IonCol,
    IonIcon, IonNote, Avatar, InlineText
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}

.authorTitle {
  /* font-size:3vw; */
  color: #428cff;
  font-size: 1.2em;
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 10px;
  padding-bottom: 0px; 
}

.authorText {
  margin-top: 10px;
}
.since {
  /* font-size:1.5vw; */
  margin-left: 5px;
  font-size: 0.8em;
}
[size="small"]{
  height: 5px;
}
</style>