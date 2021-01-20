<template>
<div class="slidebox shown" :style="extraStyle" @dblclick="like" ref="slideBox">
  <span class="like-icon" ref="liker">
    <ion-icon :icon="likeIcon"  />
  </span>

  <template v-if="is('Poll')">
    <ion-card>
      <poll :poll="obj" />
    </ion-card>
  </template>
  <template v-else-if="is('Post')">
    <ion-card class="post-text ion-padding">
      <render-md :source="text" />
      <p><reactions :item="interactivityObject" /></p>
    </ion-card>
  </template>
  <template v-else-if="is('Picture')">
    <ion-img :src="imageUrl" />
  </template>
  <div v-if="!is('Post')" class="text">
    <render-md v-if="text" :source="text" />
    <p><reactions :item="interactivityObject" /></p>
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
        :counter="interactivityObject.get('sharesCount') || 0"
      />
    </div>
    <div class="interaction">
      <router-link :to="link">
        <ion-icon :icon="commentsIcon" size="large" />
        <ion-label>{{interactivityObject.get("commentsCount") || 0}}</ion-label>
      </router-link>
    </div>
    <div class="interaction">
      <like-button
          icon-size="large"
          :has-liked="hasLiked"
          :pointer="pointer"
          :counter="interactivityObject.get('likesCount') || 0"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { IonLabel, IonIcon, IonImg, IonCard } from '@ionic/vue';
import { createAnimation } from '@ionic/core';
import { chatbubblesOutline as commentsIcon, heart as likeIcon } from 'ionicons/icons';
import Avatar from './avatar.vue';
import Poll from './poll.vue';
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import { since } from '../utils/time';
import Parse from "parse";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import RenderMd from './render-md.vue';
import Reactions from './reactions.vue';

export default defineComponent({
  name: 'NewsItem',
  emits: ['next'],
  props: {
    item: {
      type: Parse.Object,
      required: true
    },
    zIndex:{
      type: Number,
    }
  },
  components: {
    IonLabel, IonIcon, IonCard, IonImg,
    Avatar, ShareButton, Reactions, LikeButton, Poll, RenderMd
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
    objects(): Parse.Object[] {
      return (this.item.get("objects") || []).map(
            (o: Parse.Object) => this.objs[o.id])
    },
    interactivityObject(): Parse.Object {
      if (this.objects.length == 1) {
        return this.objects[0]
      }
      return this.item
    },
    obj(): Parse.Object {
      return this.objects[0]
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
    extraStyle(): object {
      const style = (this.item.get("extra") || {})['style'] || {
        'background': "var(--ion-color-tertiary )"
      };
      const localStyle = {
        'z-index': this.zIndex,
      };
      if (this.is('Poll') || this.is('Post')) {
        return Object.assign({}, style, localStyle, {
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        });
      }
      return Object.assign({}, style, localStyle);
    }
  },
  methods: {
    is(type: string): boolean {
      if (!this.obj) {
        return type == "Post"
      }
      return this.obj.className == type;
    },
    async like(ev: MouseEvent) {
      if (!this.hasLiked) {
        this.store.dispatch("auth/like", Object.assign({}, this.interactivityObject.toPointer()));
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
  overflow: hidden;
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
.post-text {
  max-width: 650px;
  width: 65vw;
  font-size: 1.1rem;
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