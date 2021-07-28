<template>
  <div
    class="slidebox shown"
    data-cy-role="news"
    :style="extraStyle"
    @dblclick="like"
    ref="slideBox"
  >
    <span class="like-icon" ref="liker">
      <ion-icon :icon="likeIcon" />
    </span>

    <template v-if="isPoll">
      <ion-card>
        <poll :poll="obj" />
      </ion-card>
    </template>
    <template v-else-if="isPost">
      <ion-card class="post-text ion-padding" data-cy-role="content">
        <render-md :source="text" />
        <p><reactions :item="interactivityObject" /></p>
      </ion-card>
    </template>
    <template v-else-if="isPicture">
      <ion-img class="item-img" :src="imageUrl" />
    </template>
    <template v-else>
      <ion-card class="post-text ion-padding">
        {{ $t("activity.unknownType") }}
        <ion-button v-if="isAndroidd" fill="outline" :href="androidLink">{{
          $t("appPage.button.android")
        }}</ion-button>
        <ion-button v-else-if="isIos" fill="outline" :href="iosLink">{{
          $t("appPage.button.iOS")
        }}</ion-button>
        <ion-button v-else fill="outline" v-on:click="reload">{{
          $t("appPage.button.refresh")
        }}</ion-button>
      </ion-card>
    </template>
    <div v-if="!isPost" class="text">
      <render-md v-if="text" :source="text" />
      <p><reactions :item="interactivityObject" /></p>
    </div>
    <div class="menu">
      <router-link :to="teamLink">
        <avatar size="4em" :profile="team" :name="teamName" />
      </router-link>
      <div class="interaction">
        <share-button
          icon-size="large"
          :link="fullLink"
          :pointer="pointer"
          :style="buttonStyle"
          :counter="interactivityObject.sharesCount || 0"
        />
      </div>
      <div class="interaction">
        <router-link :to="link" :style="buttonStyle">
          <ion-icon :icon="commentsIcon" size="large" />
          <ion-label>{{ interactivityObject.commentsCount || 0 }}</ion-label>
        </router-link>
      </div>
      <div class="interaction">
        <like-button
          icon-size="large"
          :has-liked="hasLiked"
          :pointer="pointer"
          :style="buttonStyle"
          :counter="interactivityObject.likesCount || 0"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IonLabel, IonIcon, IonImg, IonCard, IonButton } from "@ionic/vue";
import { createAnimation } from "@ionic/core";
import {
  chatbubblesOutline as commentsIcon,
  heart as likeIcon,
} from "ionicons/icons";
import Avatar from "./avatar.vue";
import Poll from "./poll.vue";
import ShareButton from "./share-button.vue";
import LikeButton from "./like-button.vue";
import { since } from "../utils/time";
import Parse from "parse";
import { defineComponent, computed } from "vue";
import { useStore } from "../stores/";
import RenderMd from "./render-md.vue";
import Reactions from "./reactions.vue";
import { Model } from "@/types/model";
import { isAndroid, isIos } from "@/utils/platform";

export default defineComponent({
  name: "NewsItem",
  emits: ["next"],
  props: {
    itemId: {
      type: String,
      required: true,
    },
    zIndex: {
      type: Number,
    },
  },
  components: {
    IonLabel,
    IonIcon,
    IonCard,
    IonImg,
    IonButton,
    Avatar,
    ShareButton,
    Reactions,
    LikeButton,
    Poll,
    RenderMd,
  },
  setup(props: { itemId: string }) {
    const store = useStore();
    return {
      item: computed(() => store.getters.objectsMap[props.itemId]),
      objs: computed(() => store.getters.objectsMap),
      store,
      commentsIcon,
      likeIcon,
      isAndroid,
      isIos,
    };
  },
  computed: {
    link(): string {
      return "/a/" + this.item.objectId;
    },
    fullLink(): string {
      return process.env.BASE_URL + this.link;
    },
    hasLiked(): boolean {
      if (!this.store.getters["auth/isLoggedIn"]) return false;
      return (
        (this.item.likedBy || []).indexOf(this.store.getters["auth/myId"]) !==
        -1
      );
    },
    team(): Model {
      return this.objs[this.item.team.objectId];
    },
    teamName(): string {
      return this.team.name;
    },
    teamLink(): string {
      return "/t/" + this.team.slug;
    },
    since(): string {
      return since(this.item.publishedAt.iso);
    },
    text(): string {
      return this.item.text || "";
    },
    objects(): Model[] {
      return (this.item.objects || []).map((o: Model) => this.objs[o.objectId]);
    },
    interactivityObject(): any {
      if (this.objects.length == 1) {
        return this.objects[0];
      }
      return this.item;
    },
    obj(): Model {
      return this.objects[0];
    },
    pointer(): Parse.Pointer {
      return this.item?.toPointer();
    },
    image(): Model | null {
      return this.item.objects.find((x: Model) => x.className == "Picture");
    },
    imageUrl(): string | null {
      return this.image?.file?.url;
    },
    buttonStyle(): object {
      const style = (this.item.extra || {})["styles"] || {};
      if (style.buttonColor) {
        return {
          color: style.buttonColor
        }
      }
      return {}
    },
    isPost(): boolean {
      return this.is("Post")
    },
    isPoll(): boolean {
      return this.is("Poll")
    },
    isPicture(): boolean {
      return this.is("Picture")
    },
    extraStyle(): object {
      const style = Object.assign(
        {
          background: "var(--ion-color-tertiary )",
        },
        (this.item.extra || {})["styles"]
      );
      const localStyle = {
        "z-index": this.zIndex,
      };
      if (!this.is("Picture")) {
        return Object.assign({}, style, localStyle, {
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        });
      }
      return Object.assign({}, style, localStyle);
    },
  },
  methods: {
    is(type: string): boolean {
      if (!this.obj) {
        return type == "Post";
      }
      return this.obj.className == type;
    },
    async like(ev: MouseEvent) {
      if (!this.hasLiked) {
        this.store.dispatch(
          "auth/like",
          Object.assign({}, this.interactivityObject.toPointer())
        );
      }
      const l: any = this.$refs.liker;
      await createAnimation()
        .addElement(l)
        .duration(800)
        .beforeStyles({
          top: `${ev.y}px`,
          left: `${ev.x}px`,
          opacity: 1,
          transform: "scale(1)",
        })
        .fromTo("transform", "scale(1)", "scale(3)")
        .afterStyles({
          opacity: 0,
          transform: "scale(1)",
        })
        .play();
    },
    next(ev: Event) {
      console.log("would go to next", ev);
    },
    reload() {
      location.reload()
    }
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
  height: 3em;
  padding-top: 0;
  bottom: 0;
  color: white;
  text-shadow: 1px 1px #000;
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
  color: var(--button-color);
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
  color: var(--button-color);
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
  font-size: 0.5em;
}
.item-img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
