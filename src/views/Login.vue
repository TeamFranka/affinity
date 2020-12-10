<template>
  <div style="padding: 0.5em;">
    <h4><button @click="$emit('route', 'Home')">test</button>Einloggen</h4>

    <ion-item>
      <ion-input type="text" required name="username" v-model="input.username" placeholder="E-Mail / Username" />
    </ion-item>

    <ion-item>
      <ion-input type="password" required name="password" v-model="input.password" placeholder="Password" />
    </ion-item>

    <div>
      <ion-button color="primary" @click="login()">
        Einloggen
      </ion-button>
      <ion-button color="dark" @click="signUp()">
        Registrieren
      </ion-button>
    </div>
    <ion-toast
      :is-open="isOpen"
      :message="message"
      :duration="2000"
      @onDidDismiss="isOpen = false"
    >
  </ion-toast>
  </div>
</template>

<script lang="ts">
import {
  IonItem, IonInput, IonButton, IonToast
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { Parse } from "../config/Consts";

export default defineComponent({
  name: 'Login',
  emits: ['route', 'user-updated'],
  components: {
    IonItem, IonInput, IonButton, IonToast
  },
  data() {
    return {
      input: {
        username: "",
        password: ""
      },
      isOpen: false,
      message: ""
    }
  },
  methods: {
    signUp() {
      console.log(this.input);
      Parse.User.signUp(this.input.username, this.input.password, {}, {}).then(async (resp) => {
        console.log('Logged in successfully', resp);

        // Clears up the form
        this.input.username = '';
        this.input.password = '';
        this.isOpen = true;
        this.message = 'Account created successfully';
        this.$emit("user-updated", resp);

        this.$emit("route", "Home");
      }, err => {
        console.log('Error signing in', err);
        this.isOpen = true;
        this.message = err.message;
      });
    },
    login() {
      Parse.User.logIn(this.input.username, this.input.password).then((resp) => {
        console.log(resp);
        this.$emit("user-updated", resp);
        this.$emit("route", "Home");
      }, err => {
        console.log('Error signing in', err);
        this.isOpen = true;
        this.message = err.message;
      });
    }
  }
})
</script>