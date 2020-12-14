<template>
    <ion-loading
      :is-open="loading"
      message="Please wait..."
      @onDidDismiss="setOpen(false)"
    />
    <div v-if="!loading">
      <header v-if="!user">
        <h3><avatar :profile="community" />Chatte mit uns</h3>
      </header>
      <section v-if="!user">
        <h1>Hi 👋!</h1>
        <p>Du hast eine Frage, brauchst Hilfe oder hast eine Anfrage? Schick uns einfach eine kurze Nachricht. Das kannst du direkt hier oder über einen der unten stehenden Messenger</p>
        <ion-button color="primary" @click="$emit('route', 'Login')">Einloggen</ion-button> <ion-button color="secondary">Registrieren</ion-button><br>
        <a @click="anonymousLogin()">mit temporärem Account fortfahren</a>

      </section>
      <section v-if="user">
        <div v-if="!convos.length" class="new-box">
          <h3>Willkommen <avatar :profile="user" with-name=true /> 👋!</h3>
          <ion-button @click="startNewChat"><avatar :profile="community" /> Jetzt chat starten!</ion-button>
        </div>
        <div v-if="convos.length" >
          <h3>Willkommen zurück <avatar :profile="user" with-name="true" /> 👋!</h3>
          <div @click="$emit('select-chat', convo)" v-for="convo in convos" v-bind:key="convo.id">
            {{convo.id}}
          </div>
        </div>

        <ion-spinner v-if="loadingConvos" name="crescent"></ion-spinner>
      </section>
    </div>
</template>

<script lang="ts">
import Avatar from "../components/avatar.vue";
import { IonButton, IonLoading, IonSpinner } from '@ionic/vue';
import { defineComponent } from 'vue';
import Parse from 'parse';


export default defineComponent({
  name: 'ChatHome',
  emits: ['route', 'user-updated', 'select-chat'],
  props: {
    user: Object,
    convos: Array,
    loadingConvos: Boolean,
    community: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  components: {
    Avatar,
    IonButton,
    IonLoading,
    IonSpinner,
  },
  methods: {
    anonymousLogin() {
      this.loading = true;
      Parse.AnonymousUtils.logIn({}).then((data: any) => {
        this.$emit("user-updated", data);
        this.loading = false
      });
    },
    async startNewChat() {
      this.loading = true;
      await Parse.Cloud.run("newPublicInboxConversation", {
        "groupId": this.community.id
      }).then(chat => {
        console.log(chat);
        this.loading = false;
        this.$emit("select-chat", chat);
      }, err => {
        this.loading = false;
        console.error("Creating new inbox convo failed", err);
      });
      return ""
    }
  }
})
</script>
<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  margin: 5px;
}
</style>