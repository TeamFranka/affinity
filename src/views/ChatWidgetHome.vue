<template>
    <header>
    <h3>Chatte mit uns</h3>
    </header>
    <section v-if="!user">
      <h1>Hi 👋!</h1>
      <p>Du hast eine Frage, brauchst Hilfe oder hast eine Anfrage? Schick uns einfach eine kurze Nachricht. Das kannst du direkt hier oder über einen der unten stehenden Messenger</p>
      <ion-button color="primary" @click="$emit('route', 'Login')">Einloggen</ion-button> <ion-button color="secondary">Registrieren</ion-button><br>
      <a @click="anonymousLogin()">mit temporärem Account fortfahren</a>

      <ion-loading
        :is-open="loading"
        message="Please wait..."
        @onDidDismiss="setOpen(false)"
      />
    </section>
    <section v-if="user">
      <h1>Willkommen zurück {{user.id}} 👋!</h1>

      <div>
        <div v-for="convo in convos" v-bind:key="convo.id">
          {{convo.id}}
        </div>
      </div>

      <ion-spinner v-if="loadingConvos" name="crescent"></ion-spinner>
    </section>
    <footer><input style="text"/></footer>
</template>

<script lang="ts">
import { IonButton, IonLoading, IonSpinner } from '@ionic/vue';
import { defineComponent } from 'vue';
import { AnonymousUtils } from 'parse';


export default defineComponent({
  name: 'ChatHome',
  emits: ['route', 'user-updated'],
  props: {
    user: Object,
    convos: Array,
    loadingConvos: Boolean,
  },
  data() {
    return {
      loading: false
    }
  },
  components: {
    IonButton,
    IonLoading,
  },
  methods: {
    anonymousLogin() {
      this.loading = true;
      AnonymousUtils.logIn({}).then((data: any) => {
        this.$emit("user-updated", data);
        this.loading = false
      });
    }
  }
})
</script>,