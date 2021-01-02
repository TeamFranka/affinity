<template>
<div class="slidebox shown" @dblclick="like" ref="slideBox">
  <span class="like-icon" ref="liker">
    <ion-icon :icon="likeIcon"  />
  </span>
  <img :src="imageUrl" />
  <div class="text">
    <p v-if="text">{{text}}</p>
    <p><reactions :item="item" /></p>
  </div>
  <div class="menu">
    <router-link :to="teamLink">
      <avatar size="4em" :profile="teamSettings" :name="teamName" />
    </router-link>
    <div class="interaction">
      <share-button
        icon-size="large"
        :link="fullLink"
        :pointer="pointer"
        :counter="item.get('sharesCount') || 0"
      />
    </div>
    <div class="interaction">
      <router-link :to="link">
        <ion-icon :icon="commentsIcon" size="large" />
        <ion-label>{{item.get("commentsCount") || 0}}</ion-label>
      </router-link>
    </div>
    <div class="interaction">
      <like-button
          icon-size="large"
          :has-liked="hasLiked"
          :pointer="pointer"
          :counter="item.get('likesCount') || 0"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { IonLabel, IonIcon } from '@ionic/vue';
import { createAnimation } from '@ionic/core';
import { chatbubblesOutline as commentsIcon, heart as likeIcon } from 'ionicons/icons';
import Avatar from './avatar.vue';
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import { since } from '../utils/time';
import Parse from "parse";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import Reactions from './reactions.vue';

export default defineComponent({
  name: 'NewsItem',
  emits: ['next'],
  props: {
    item: {
      type: Parse.Object,
      required: true
    },
  },
  components: {
    Avatar, ShareButton, Reactions, IonLabel, IonIcon, LikeButton
  },
  setup() {
    const store = useStore();
    return {
      objs: computed(() => store.getters.objectsMap),
      store, commentsIcon, likeIcon
    }
  },
  computed: {
    link(): string {
      return '/a/' + this.item.id
    },
    fullLink(): string {
      return process.env.BASE_URL + this.link;
    },
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.item.get("likedBy") || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    team(): Parse.Object {
      const team = this.item.get("team");
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
    since(): string {
      return since(this.item.get("createdAt"))
    },
    text(): string {
        return this.item.get("text") || ""
    },
    objects(): Parse.Object {
      return (this.item.get("objects") || []).map(
            (o: Parse.Object) => this.objs[o.id])
    },
    pointer(): Parse.Pointer {
      return this.item.toPointer()
    },
    image(): Parse.Object | null {
        return this.item.get("objects").find((x: Parse.Object) => x.className == "Picture");
    },
    imageUrl(): string | null {
        return this.image?.get("file")?.url()
    },
  },
  methods: {
    async like(ev: MouseEvent) {
      console.log("would like", ev);
      if (!this.hasLiked) {
        this.store.dispatch("auth/like", Object.assign({}, this.pointer));
      }
      const l: any = this.$refs.liker;
      await createAnimation()
        .addElement(l)
        .duration(800)
        .beforeStyles({
          top: `${ev.y}px`,
          left: `${ev.x}px`,
          opacity: 1,
          transform: 'scale(1)',
        })
        .fromTo('transform', 'scale(1)', 'scale(3)')
        .afterStyles({
          "opacity": 0,
          transform: 'scale(1)',
        })
        .play();
    },
    next(ev: Event) {
      console.log("would go to next", ev);
    },
  },
});
</script>
<style scoped>
.slidebox {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  right: 0;
  transition: 0.25s ease-out;
}
.slidebox.hidden {
  transform: translateY(-100%);
}
.slidebox > img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
.slidebox > .text {
  position: absolute;
  bottom: 1em;
  color: white;
  left: 1em;
  right: calc(0.5em + 65px);
}
.menu {
  position: absolute;
  bottom: 1em;
  right: 0.5em;
  width: 60px;
  display: flex;
  flex-direction: column-reverse;
  align-content: center;
  color: white;
}
.like-icon {
  position: absolute;
  transform-origin: bottom;
  opacity: 0;
  width: 3em;
  height: 3em;
  color: #900;
}
.menu a {
  color: white;
  text-decoration: none;

}
.interaction {
  margin-bottom: 0.5em;
}
.interaction,
.interaction > span,
.interaction > a {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.interaction > span ion-label {
  font-size: 0.5em
}
</style>