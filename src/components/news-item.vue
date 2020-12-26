<template>
<div class="slidebox shown" ref="slideBox">
    <img :src="imageUrl" />
    <p class="text" v-if="text">{{text}}</p>
    <div class="interactions">
    <avatar :profile="item.get('team')" />
    </div>
</div>
</template>


<script lang="ts">
import { createGesture } from '@ionic/vue';
import Avatar from './avatar.vue';
import Parse from "parse";
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NewsItem',
  props: {
    item: {
      type: Parse.Object,
      required: true
    },
  },
  components: {
    Avatar,
  },
  mounted() {

    // const c: any  = this.$refs.slideBox;

    // const gesture = createGesture({
    //   el: c,
    //   gestureName: "flip-away",
    //   threshold: 0,
    //   onStart: ev => {
    //     c.style.transition = "0.25s ease-out";
    //     console.log("Started on ", c);
    //   },
    //   onMove: ev => {
    //       console.log(ev);
    //     if (ev.deltaY < 0) {
    //       c.style.transform = `translateY(${ev.deltaY}px)`;
    //     }
    //   },
    //   onEnd: ev => {
    //     if (ev.deltaY < -150) {
    //       c.classList.add("hidden");
    //       c.style.transform = 'translateY(-100%)';
    //     } else {
    //       c.style.transform = '';
    //     }
    //     console.log("End");
    //   },
    // });

    // gesture.enable();
  },
  computed: {
    image(): Parse.Object | null {
        return this.item.get("objects").find((x: Parse.Object) => x.className == "Picture");
    },
    imageUrl(): string | null {
        return this.image?.get("file")?.url()
    },
    text(): string {
        return this.item.get("text")
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
}
.slidebox.hidden {
  top: -100%;
  bottom: unset;
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
}
.slidebox .interactions {
  position: absolute;
  bottom: 1em;
  right: 0.5em;
  width: 60px;
  display: flex;
  flex-direction: row-reverse;
}
</style>