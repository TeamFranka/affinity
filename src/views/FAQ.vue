<template>
  <ion-page>
    <ion-content fullscreen>
        <ion-searchbar></ion-searchbar>
        <faq-entry v-for="e in content" v-bind:title="e.title" v-bind:key="e.title" v-bind:topic="e.topic">{{e.content}}</faq-entry>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import FaqEntry from '../components/faq-entry.vue';
import { IonContent, IonSearchbar, IonPage, } from '@ionic/vue';
import { chatbubbles, logoWhatsapp } from 'ionicons/icons';
import { defineComponent } from 'vue';

const content = [
    {
        title: "Wie erreichen wir das 1,5-Grad-Ziel?",
        thema: "Klima",
        content: "Damit Ihr indess erkennt, woher dieser ganze Irrthum gekommen ist, und weshalb man die Lust anklagt und den Schmerz lobet, so will ich Euch Alles eröffnen und auseinander setzen, was jener Begründer der Wahrheit und gleichsam Baumeister des glücklichen Lebens selbst darüber gesagt hat. Niemand, sagt er, verschmähe, oder hasse, oder fliehe die Lust als solche, sondern weil grosse Schmerzen ihr folgen, wenn man nicht mit Vernunft ihr nachzugehen verstehe."
    },
    {
        title: "Aber wenn china doch auch nichts macht?",
        thema: "Klimagerechtigkeit",
        content: "Damit Ihr indess erkennt, woher dieser ganze Irrthum gekommen ist, und weshalb man die Lust anklagt und den Schmerz lobet, so will ich Euch Alles eröffnen und auseinander setzen, was jener Begründer der Wahrheit und gleichsam Baumeister des glücklichen Lebens selbst darüber gesagt hat. Niemand, sagt er, verschmähe, oder hasse, oder fliehe die Lust als solche, sondern weil grosse Schmerzen ihr folgen, wenn man nicht mit Vernunft ihr nachzugehen verstehe."
    },
    {
        title: "Aber Bio-Fleisch kann sich nicht jede:r leisten!",
        thema: "Klimagerechtigkeit",
        content: "Damit Ihr indess erkennt, woher dieser ganze Irrthum gekommen ist, und weshalb man die Lust anklagt und den Schmerz lobet, so will ich Euch Alles eröffnen und auseinander setzen, was jener Begründer der Wahrheit und gleichsam Baumeister des glücklichen Lebens selbst darüber gesagt hat. Niemand, sagt er, verschmähe, oder hasse, oder fliehe die Lust als solche, sondern weil grosse Schmerzen ihr folgen, wenn man nicht mit Vernunft ihr nachzugehen verstehe."
    },
    {
        title: "Was ist mit der Auto-Industrie/-Arbeitsplätze?",
        thema: "Klima",
        content: "Damit Ihr indess erkennt, woher dieser ganze Irrthum gekommen ist, und weshalb man die Lust anklagt und den Schmerz lobet, so will ich Euch Alles eröffnen und auseinander setzen, was jener Begründer der Wahrheit und gleichsam Baumeister des glücklichen Lebens selbst darüber gesagt hat. Niemand, sagt er, verschmähe, oder hasse, oder fliehe die Lust als solche, sondern weil grosse Schmerzen ihr folgen, wenn man nicht mit Vernunft ihr nachzugehen verstehe."
    },
];

export default defineComponent({
  name: 'Faq',
  setup() {
    return {
      chatbubbles, logoWhatsapp, content
    }
  },
  components: {
    IonPage,
    IonContent,
    IonSearchbar,
    FaqEntry,
  }
});
</script>