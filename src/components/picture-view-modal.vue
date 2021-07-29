<template>
 <div class="slidebox" :class="shown ? 'shown' : 'hidden'" :style="extraStyle" @dblclick="like" ref="slideBox">
  <span class="like-icon" ref="liker">
    <ion-icon :icon="likeIcon"  />
  </span>

    <ion-img class="item-img" :src="imageUrl" />

   <div class="menu">
    <router-link :to="teamLink">
      <avatar size="4em" :profile="team" :name="teamName" />
    </router-link>
    <div class="interaction">
      <share-button
        icon-size="large"
        :link="fullLink"
        :pointer="pointer"
        :counter="interactivityObject.sharesCount || 0"
      />
    </div>
    <div class="interaction">
      <router-link :to="link">
        <ion-icon :icon="commentsIcon" size="large" />
        <ion-label>{{interactivityObject.commentsCount || 0}}</ion-label>
      </router-link>
    </div>
    <div class="interaction">
      <like-button
          icon-size="large"
          :has-liked="hasLiked"
          :pointer="pointer"
          :counter="interactivityObject.likesCount || 0"
      />
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { IonLabel, IonIcon, IonImg } from '@ionic/vue';
import { createAnimation } from '@ionic/core';
import { chatbubblesOutline as commentsIcon, heart as likeIcon } from 'ionicons/icons';
import Avatar from './avatar.vue';
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import { since } from '../utils/time';
import Parse from "parse";
import { defineComponent, computed } from 'vue';
import { useStore } from '../stores/';
import { Model } from '@/types/model';

export default defineComponent({
  name: 'PictureViewModal',
  emits: ['next'],
  props: {
    itemId: {
      type: String,
      required: true
    },
    zIndex:{
      type: Number,
      required: true
    },
    shown: {
      type: Boolean,
      required: true
    }
  },
  components: {
    IonLabel, IonIcon,
    IonImg,
    Avatar, ShareButton, LikeButton,
  },
  setup(props: { itemId: string }) {
    const store = useStore();

    return {
      item: computed(() => store.getters.objectsMap[props.itemId]),
      objs: computed(() => store.getters.objectsMap),
      store, commentsIcon, likeIcon
    }
  },
  computed: {

    link(): string {
      return '/a/' + this.item.objectId
    },
    fullLink(): string {
      return process.env.BASE_URL + this.link;
    },
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (this.item.likedBy || []).indexOf(this.store.getters["auth/myId"]) !== -1;
    },
    team(): Model {
      return this.objs[this.item.team.objectId]
    },
    teamName(): string {
      return this.team.name
    },
    teamLink(): string {
      return '/t/' + this.team.slug
    },
    since(): string {
      return since(this.item.createdAt)
    },
    text(): string {
        return this.item.text || ""
    },
    objects(): Model[] {
      return (this.item.objects || []).map(
            (o: Model) => this.objs[o.objectId])
    },
    interactivityObject(): any {
      if (this.objects.length == 1) {
        return this.objects[0]
      }
      return this.item
    },
    obj(): Model {
      return this.objects[0]
    },
    pointer(): Parse.Pointer {
      return this.item?.toPointer()
    },
    imageUrl(): string | null {
        return this.item.file.url
    },
    extraStyle(): object {
      const style =  {
        'background': "var(--ion-color-tertiary )"
      };
      const localStyle = {
        'z-index': this.zIndex,
      };
      return Object.assign({}, style, localStyle);

    }
  },
  methods: {

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
  display: flex;
  align-content: center;
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
.item-img{
    display: block;
    height: 100%;
    width: 100%;
    object-fit: contain;
}
</style>