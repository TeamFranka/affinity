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
            <ion-button fill="clear" size="large">
              Let's go
              <ion-icon slot="end" :icon="arrowForward"></ion-icon>
            </ion-button>
          </div>
        </ion-slide>
        <ion-slide>
          <my-teams />
        </ion-slide>
        <ion-slide>
          <h1>Slide 3</h1>
        </ion-slide>
      </ion-slides>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonSlides, IonSlide, IonPage, IonButton, IonIcon } from "@ionic/vue";
import { arrowForward } from "ionicons/icons";
import MyTeams from "@/components/my-teams.vue";

// import { useStore } from "../stores/";

export default defineComponent({
  components: { IonSlides, IonSlide, IonPage, IonButton, IonIcon, MyTeams },
  setup() {
    // const store = useStore();

    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      zoom: false,
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 0,
    };

    return { slideOpts, arrowForward };
  },
  methods: {
    async slideTo(index: number) {
      const slider = this.$refs.sliderRef as typeof IonSlides;
      await slider.$el.slideTo(index);
    },
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
  padding-bottom: 120px;
}

ion-slide > img {
  display: block;
}
</style>