<template>
  <ion-page>
    <div class="wrapper">
      <ion-slides pager="true" :options="slideOpts" ref="sliderRef">
        <ion-slide>
          <img src="assets/welcome.svg" alt="Welcome" />
          <div class="ion-padding" @click="slideTo(1)">
            <h1>Welcome</h1>
            <p>
              Glad, you've decided to join us. <br />Just a few more steps to
              get you all set up and ready to go.
            </p>
            <ion-button
              fill="clear"
              size="large"
              data-cy="welcome-slide1-next-button"
            >
              Let's go
              <ion-icon slot="end" :icon="arrowForward"></ion-icon>
            </ion-button>
          </div>
        </ion-slide>
        <ion-slide>
          <my-teams />
          <ion-button class="done" fill="outline" size="large" @click="done()">
            Done
            <ion-icon slot="end" :icon="checkmark"></ion-icon>
          </ion-button>
        </ion-slide>
      </ion-slides>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { IonSlides, IonSlide, IonPage, IonButton, IonIcon } from "@ionic/vue";
import { arrowForward, checkmark } from "ionicons/icons";
import MyTeams from "@/components/my-teams/my-teams.vue";
import { useStore } from "@/stores";

export default defineComponent({
  components: { IonSlides, IonSlide, IonPage, IonButton, IonIcon, MyTeams },
  setup() {
    const { dispatch } = useStore();
    const sliderRef = ref<typeof IonSlides>();
    const router = useRouter();

    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      zoom: false,
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 0,
    };

    async function slideTo(index: number) {
      const slider = sliderRef.value;
      await slider?.$el.slideTo(index);
    }

    async function done() {
      await dispatch("auth/setWelcomeDone");
      router.push("/");
    }

    return { slideTo, done, sliderRef, slideOpts, checkmark, arrowForward };
  },
});
</script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100%;
  display: flex;
}

ion-slide {
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}

ion-slide > img {
  display: block;
}

.done {
  align-self: flex-end;
  margin: 10px 10px 0 0;
}
</style>