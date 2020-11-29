<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding" scroll-y="false">
      <ion-slides :options="{direction: 'vertical'}">
        <ion-slide>
          <div class="slide">
            <img src="../statics/franka1.png"/>
            <h2>Welcome</h2>
            <p>The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a demonstration of proper code use.</p>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide">
            <img src="../statics/franka1.png"/>
            <h2>What is Ionic?</h2>
            <p><b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.</p>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide">
            <img src="../statics/franka1.png"/>
            <h2>What is Ionic Appflow?</h2>
            <p><b>Ionic Appflow</b> is a powerful set of services and features built on top of Ionic Framework that brings a totally new level of app development agility to mobile dev teams.</p>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide">
            <img src="../statics/franka1.png"/>
            <h2>Ready to Play?</h2>
            <ion-button fill="clear">Continue <ion-icon slot="end" name="arrow-forward"></ion-icon></ion-button>
          </div>
        </ion-slide>

      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonSlide, IonPage, IonSlides } from '@ionic/vue';
import { chatbubbles, logoWhatsapp } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  setup() {
    return {
      chatbubbles, logoWhatsapp,
    }
  },
  components: {
    IonContent,
    IonSlide,
    IonSlides,
    IonPage,
  }
});
</script>
<style scoped>
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}
</style>