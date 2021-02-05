<template>
  <ion-chip @click="toggleComments()" color="medium">
      <ion-icon :icon="showComments ? commentsIconB : commentsIcon" :color="showComments ? 'primary' : ''" size="small" />
      <ion-label>{{counter}}</ion-label>
    </ion-chip>
    <div v-if="showComments">
        <ion-spinner v-if="commentsLoading" />
        <inline-text
        :value="draft"
        :canSubmit="!!(draft && draft.length >= 3)"
        placeholder="comment here"
        @submit="submitComment()"
        @changed="setDraft($event)"
        />
    <!-- <ion-grid>
      <comment
        v-for="c in comments"
        :commentId="c.objectId"
        :key="c.oobjectId"
        :children="c.comments"
        :object="pointer"
      />
    </ion-grid> -->
  </div>
</template>

<script lang="ts">
import {
    IonChip, IonLabel, IonIcon,
} from '@ionic/vue';
import {
    chatbubbles, chatbubblesOutline
} from 'ionicons/icons';
import Comment from './comment.vue';
import InlineText from './inline-text.vue';
import { defineComponent } from 'vue';
import { Model } from '@/utils/model';
import { useStore } from '../stores/';
import { Parse } from '../config/Consts';

export default defineComponent({
    name: 'CommentButton',
    props: {
        object: {
            type: Model,
            required: false
        },
        counter: {
            type: Number,
            required: true
        },
        pointer: {
            type: Parse.Pointer,
            required: true
        },
        startCommentsOpen: Boolean,
    },
    data(props) {
        return {
            disabled: false,
            showComments: props.startCommentsOpen,
            comment: ""
        }
    },
    setup() {
        const store = useStore();
        return {
            store,
            commentsIcon: chatbubblesOutline,
            commentsIconB: chatbubbles,
        }
    },
    computed: {
        // pointer(): Parse.Pointer {
        //     return this.object.toPointer()
        // },
        // draft(): string {
        //     const d = this.store.state.comments.drafts[this.object.objectID];
        //     if (d) {
        //         return d[""]
        //     }
        //     return ""
        // },
        // commentsLoading(): boolean {
        //     const s = this.store.state.comments[this.object.objectID];
        //     if (s) {
        //         return s.loading
        //     }
        //     return false
        // },
        // comments(): Array<any> {
        //     const s = this.store.state.comments.comments[this.object.objectID];
        //     if (s) {
        //         return s.comments
        //     }
        //     return []
        // },
    },
    methods: {
        async toggleComments() {
            if (this.showComments) {
                this.showComments = false;
                return
            }
            await this.store.dispatch("comments/loadComments", this.object.toPointer());
            this.showComments = true;
        },
        // setDraft(text: string) {
        //     this.store.commit("comments/setDraft", {
        //     objectId: this.object.objectId,
        //     text
        //     });
        // },
        // submitComment(){
        //     const text = this.comment;
        //     console.log("submitting", text);
        //     this.store.dispatch("comments/submitDraft", {
        //         ptr: this.object.toPointer(),
        //         text
        //     });
        // }
    },
    components: {
        IonChip, IonIcon, IonLabel, InlineText
    },
});
</script>

<style scoped>

</style>