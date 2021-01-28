<template>
<ion-card data-cy-type="activity" :data-cy-verb="activity.verb">
  <ion-card-header>
    <div class="avatar-wrap">
      <router-link v-if="showAuthor" :to="{name: 'ViewUser', params:{userId: author.objectId}}">
        <avatar :profile="author" />
      </router-link>
      <router-link
        v-else
        :to="teamLink"
      >
          <avatar :profile="team" :name="teamName" v-if="!showAuthor"/>
      </router-link>
    </div>
    <div class="ion-padding-start">
      <div v-if="showAuthor">
        {{authorName}}<span v-if="showTeam"><ion-icon :icon="teamSplitterIcon" /> <router-link :to="teamLink">{{teamName}}</router-link
        ></span>
      </div>
      <div v-if="!showAuthor">
        <router-link :to="teamLink">{{teamName}}</router-link>
      </div>
      <router-link :to="link">
          <ion-note color="medium">{{since}}</ion-note>
        </router-link>
    </div>
  </ion-card-header>
  <div>
    <div class="ion-padding" data-cy-role="content">
      <render-md :source="text" />
    </div>
    <div v-for="obj in objects" :key="obj.objectId" class="ion-padding">
      <div v-if="obj.className == 'Poll'" data-cy-obj="poll">
        <poll :poll="obj" />
      </div>
      <div v-else-if="obj.className == 'Picture'" data-cy-obj="picture">
        <ion-img :src="obj.file.url" />
      </div>
      <div v-else-if="obj.className == 'Link'" data-cy-obj="link">
        <ion-icon :icon="linkIcon" color="secondary"></ion-icon>
        <a :href="obj.url">{{obj.title}}</a>
        <ion-img v-if="obj.previewImage" :src="obj.previewImage.url" />
        <p v-if="obj.description">{{obj.description}}</p>
      </div>
      <div v-else-if="obj.className == 'Document'" data-cy-obj="document">
        <ion-icon :icon="documentIcon" color="secondary"></ion-icon>
        <a :href="obj.url">{{obj.title}}</a>
      </div>
      <div v-else>{{obj}}</div>
    </div>
  </div>
  <interaction-bar :object="interactivityObject" :link="link" />
</ion-card>
</template>
<script lang="ts">
import {
  IonCard, IonImg, IonCardHeader, IonIcon, IonNote,
} from '@ionic/vue';
import {
  chatbubblesOutline, addOutline, arrowRedoOutline, heartOutline,
  linkOutline as linkIcon,
  documentOutline as documentIcon,
} from 'ionicons/icons';

import Avatar from "./avatar.vue";
import InteractionBar from "./interaction-bar.vue";
import Poll from "./poll.vue";
import RenderMd from './render-md.vue';
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse } from "../config/Consts";
import { since } from "../utils/time";
import { Model } from '@/utils/model';

export default defineComponent({
  name: 'Activity',
  props: {
    activity: {
      type: Model,
      required: true
    },
    showTeam: Boolean,
    startCommentsOpen: Boolean,
  },
  data(props) {
    return {
      showComments: props.startCommentsOpen,
      comment: ""
    }
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
      linkIcon, documentIcon,
    }
  },
  computed: {
    link(): string {
      return '/a/' + this.activity.objectId
    },
    team(): Model {
      return this.objs[this.activity.team.objectId];
    },
    teamName(): string {
      return this.team.name
    },
    teamLink(): string {
      return '/t/' + this.team.slug
    },
    showAuthor(): boolean {
      if (this.activity.verb == "announce") {
        // announcement show the team as author
        return false
      }
      return true
    },
    author(): Model {
      return this.objs[this.activity.author.objectId]
    },
    since(): string {
      return since(this.activity.createdAt)
    },
    text(): string {
        return this.activity.text || ""
    },
    objects(): Model[] {
      return (this.activity.objects || []).map(
            (o: Model) => this.objs[o.objectId])
    },
    pointer(): Parse.Pointer {
      return this.activity.toPointer()
    },
    authorName(): string {
      const author = this.author;
      return author ? (author.name || author.username) : "(hidden)"
    },
    interactivityObject(): Model {
      if (this.objects.length == 1) {
        return this.objects[0]
      }
      return this.activity
    }
  },
  methods: {
    async toggleComments() {
      if (this.showComments) {
        this.showComments = false;
        return
      }
      await this.store.dispatch("comments/loadComments", this.activity.toPointer());
      this.showComments = true;
    },
    setDraft(text: string) {
      this.store.commit("comments/setDraft", {
        objectId: this.activity.objectId,
        text
      });
    },
    submitComment(){
      const text = this.comment;
      this.store.dispatch("comments/submitDraft", {
        ptr: this.activity.toPointer(),
        text
      });
    }
  },
  components: {
    IonCard, IonImg, InteractionBar, IonCardHeader, Poll,
    IonIcon, IonNote, Avatar, RenderMd,
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
.avatar-wrap {
  width: 5em;
}
</style>