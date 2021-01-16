<template>
<ion-card>
  <ion-card-header>
    <div class="avatar-wrap" @click="$router.push('/me')">
      <avatar :profile="author" v-if="showAuthor"/>
      <div v-else>
        <router-link :to="teamLink"><avatar :profile="teamSettings" :name="teamName" v-if="!showAuthor"/></router-link>
      </div>
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
    <div class="ion-padding">
      {{ text }}
    </div>
    <div v-for="obj in objects" :key="obj.id" class="ion-padding">
      <div v-if="obj.className == 'Poll'">
        <poll :poll="obj" />
      </div>
      <div v-if="obj.className == 'Picture'">
        <ion-img :src="obj.get('file').url()" />
      </div>
    </div>
  </div>
  <interaction-bar :object="activity" :link="link" />
</ion-card>
</template>
<script lang="ts">
import {
  IonCard, IonImg, IonCardHeader, IonIcon, IonNote,
} from '@ionic/vue';
import { chatbubblesOutline, addOutline, arrowRedoOutline, heartOutline } from 'ionicons/icons';

import Avatar from "./avatar.vue";
import InteractionBar from "./interaction-bar.vue";
import Poll from "./poll.vue";
import { useStore } from '../stores/';
import { defineComponent, computed } from 'vue';
import { Parse } from "../config/Consts";
import { createAnimation } from '@ionic/core';
import { since } from "../utils/time";

export default defineComponent({
  name: 'Activity',
  props: {
    activity: {
      type: Parse.Object,
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
    }
  },
  computed: {
    link(): string {
      return '/a/' + this.activity.id
    },
    team(): Parse.Object {
      const team = this.activity.get("team");
      if (team.isDataAvailable()) {
        return team;
      }
      return this.objs[team.id]
    },
    teamSettings(): Parse.Object {
      const settings = this.team.get("settings");
      if (settings.isDataAvailable()) {
        return settings;
      }
      return this.objs[settings.id]
    },
    teamName(): string {
      return this.team.get("name")
    },
    teamLink(): string {
      return '/t/' + this.team.get("slug")
    },
    showAuthor(): boolean {
      if (this.activity.get("verb") == "announce") {
        // announcement show the team as author
        return false
      }
      return true
    },
    author(): Parse.Object {
      const author = this.activity.get("author");
      if (author.isDataAvailable()) {
        return author;
      }
      return this.objs[author.id]
    },
    since(): string {
      return since(this.activity.get("createdAt"))
    },
    text(): string {
        return this.activity.get("text") || ""
    },
    objects(): Parse.Object {
      return (this.activity.get("objects") || []).map(
            (o: Parse.Object) => this.objs[o.id])
    },
    pointer(): Parse.Pointer {
      return this.activity.toPointer()
    },
    authorName(): string {
      const author = this.author;
      return author ? (author.get("name") || author.get("username")) : "(hidden)"
    },
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
        objectId: this.activity.id,
        text
      });
    },
    submitComment(){
      const text = this.comment;
      console.log("submitting", text);
      this.store.dispatch("comments/submitDraft", {
        ptr: this.activity.toPointer(),
        text
      });
    }
  },
  components: {
    IonCard, IonImg, InteractionBar, IonCardHeader, Poll,
    IonIcon, IonNote, Avatar,
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