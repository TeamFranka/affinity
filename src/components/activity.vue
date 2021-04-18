<template>
  <ion-card
    data-cy-type="activity"
    :data-cy-team="team.slug"
    :data-cy-verb="activity.verb"
  >
    <!-- BIREF VIEW -->
    <ion-card-header v-if="briefView">
      <div class="avatar-wrap-sml">
        <router-link
          v-if="showAuthor"
          :to="{ name: 'ViewUser', params: { userId: author.objectId } }"
        >
          <avatar :profile="author" size="2em" />
        </router-link>
        <router-link v-else :to="teamLink">
          <avatar
            :profile="team"
            :name="teamName"
            v-if="!showAuthor"
            size="2em"
          />
        </router-link>
      </div>
      <div v-if="showAuthor" class="ion-padding-end">
        {{ authorName
        }}<span v-if="showTeam"
          ><ion-icon :icon="teamSplitterIcon" />
          <router-link :to="teamLink">{{ teamName }}</router-link></span
        >
      </div>
      <div v-if="!showAuthor" class="ion-padding-end">
        <router-link :to="teamLink">{{ teamName }}</router-link>
      </div>
      <i18n-t keypath="activity.shared" tag="ion-note" color="medium">
        <template v-slot:since>
          <router-link data-cy="activityLink" :to="link">{{
            since
          }}</router-link>
        </template>
      </i18n-t>
    </ion-card-header>
    <!-- REGULAR FULL VIEW -->
    <ion-card-header v-else>
      <div class="avatar-wrap">
        <router-link
          v-if="showAuthor"
          :to="{ name: 'ViewUser', params: { userId: author.objectId } }"
        >
          <avatar :profile="author" />
        </router-link>
        <router-link v-else :to="teamLink">
          <avatar :profile="team" :name="teamName" />
        </router-link>
      </div>
      <div class="ion-padding-start">
        <div v-if="showAuthor">
          <span v-if="showTeam">
            <router-link :to="teamLink">
              <avatar size="1.25em" :profile="team" :name="teamName" withName />
            </router-link>
            <ion-icon :icon="teamSplitterIcon" />
          </span>
          {{ authorName }}
        </div>
        <div v-else>
          <router-link :to="teamLink">{{ teamName }}</router-link>
        </div>
        <router-link data-cy="activityLink" :to="link">
          <ion-note color="medium">{{ since }}</ion-note>
        </router-link>
      </div>
    </ion-card-header>
    <div data-cy-role="content">
      <div v-if="text" class="ion-padding">
        <render-md :source="text" />
      </div>
      <div :class="objectsClass">
        <render-objects :objects="objects" />
      </div>
    </div>
    <interaction-bar :object="interactivityObject" :link="link" />
  </ion-card>
</template>
<script lang="ts">
import { IonCard, IonCardHeader, IonIcon, IonNote } from "@ionic/vue";
import {
  chevronForwardOutline as teamSplitterIcon,
  chatbubblesOutline,
  addOutline,
  arrowRedoOutline,
  heartOutline,
} from "ionicons/icons";

import Avatar from "./avatar.vue";
import RenderObjects from "./render-objects.vue";
import InteractionBar from "./interaction-bar.vue";
import RenderMd from "./render-md.vue";
import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";
import { Parse } from "../config/Consts";
import { since } from "../utils/time";
import { Model } from "@/utils/model";

export default defineComponent({
  name: "Activity",
  props: {
    activity: {
      type: Model,
      required: true,
    },
    showTeam: Boolean,
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
      teamSplitterIcon,
      shareIcon: arrowRedoOutline,
      plusIcon: addOutline,
      likeIcon: heartOutline,
    };
  },
  computed: {
    briefView(): boolean {
      return (
        this.text.trim().length == 0 &&
        this.objects.length == 1 &&
        this.objects[0].className == "Link"
      );
    },
    objectsClass(): string {
      return this.text != ""
        ? "ion-padding"
        : "ion-padding-start ion-padding-end";
    },
    link(): string {
      return "/a/" + this.activity.objectId;
    },
    team(): Model {
      return this.objs[this.activity.team.objectId];
    },
    teamName(): string {
      return this.team.name;
    },
    teamLink(): string {
      return "/t/" + this.team.slug;
    },
    showAuthor(): boolean {
      if (this.activity.verb == "announce") {
        // announcement show the team as author
        return false;
      }
      return true;
    },
    author(): Model {
      return this.objs[this.activity.author.objectId];
    },
    since(): string {
      return since(this.activity.createdAt);
    },
    text(): string {
      return this.activity.text || "";
    },
    objects(): Model[] {
      return (this.activity.objects || []).map(
        (o: Model) => this.objs[o.objectId]
      );
    },
    pointer(): Parse.Pointer {
      return this.activity.toPointer();
    },
    authorName(): string {
      const author = this.author;
      return author ? author.name || author.username : "(hidden)";
    },
    interactivityObject(): Model {
      if (this.objects.length == 1) {
        return this.objects[0];
      }
      return this.activity;
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
        this.activity.toPointer()
      );
      this.showComments = true;
    },
    setDraft(text: string) {
      this.store.commit("comments/setDraft", {
        objectId: this.activity.objectId,
        text,
      });
    },
    submitComment() {
      const text = this.comment;
      this.store.dispatch("comments/submitDraft", {
        ptr: this.activity.toPointer(),
        text,
      });
    },
  },
  components: {
    IonCard,
    InteractionBar,
    IonCardHeader,
    IonIcon,
    IonNote,
    Avatar,
    RenderMd,
    RenderObjects,
  },
});
</script>
<style scoped>
ion-card-header {
  display: flex;
  align-items: center;
}
.avatar-wrap-sml {
  width: 2.3em;
}
.avatar-wrap {
  width: 5em;
}
.link-preview {
  display: flex;
}
@media only screen and (min-width: 800px) {
  .picture {
    height: 600px;
    width: 100%;
  }

  .picture ion-img {
    width: auto;
    height: 100%;
  }
}
</style>
