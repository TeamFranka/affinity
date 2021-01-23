<template>
  <ion-header>
    <ion-toolbar>
      <ion-segment :value="action" @ionChange="switchAction($event.target.value)">
        <ion-segment-button value="login">
          <ion-label>Einloggen</ion-label>
        </ion-segment-button>
        <ion-segment-button value="register">
          <ion-label>Registrieren</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-button
        v-if="withCloser"
        color="dark"
        fill="clear"
        @click="$emit('close')"
        slot="end"
      >
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <h4 v-if="action == 'login'">Einloggen</h4>
    <h4 v-else>Registrieren</h4>

    <div
      v-if="error.code"
      class="warning ion-padding"
    >
      <template v-if="error.code == 101">
        <strong>Username/Passwort stimmt nicht</strong>. Möchtest du statt dessen
        <ion-button
          fill="clear" type="a" @click="switchAction('register')"
        >einen Account anlegen</ion-button>
        <ion-button
          fill="clear" type="a" @click="passwortReset"
        >dein Passwort zurücksetzen</ion-button>
      </template>
      <template v-else-if="error.code == 202">
        Der Nutzername existiert schon. Ist es deiner? Möchtest du
        vielleicht <a href="/">dein Passwort zurücksetzen</a>?
      </template>
      <template v-else-if="error.code == 203">
        Die Email existiert schon. Ist es deine? Möchtest du
        vielleicht <a href="/">dein Passwort zurücksetzen</a>?
      </template>
      <template v-else>
        {{error.message}} <i>Code: {{error.code}}</i>
      </template>
    </div>

    <form @submit="login($event)" v-if="action =='login'" class="ion-padding">
      <ion-item>
        <ion-input type="text" required name="username" v-model="input.username" placeholder="Username / E-Mail" />
        <ion-input type="password" required name="password" v-model="input.password" placeholder="Password" />
      </ion-item>
      <ion-item lines="none">
        <ion-button
          @click="passwortReset"
          slot="end"
          fill="none"
          color="medium"
        >
          Passwort vergessen
        </ion-button>
        <ion-button
          size="normal"
          slot="end"
          fill="outline"
          color="primary"
          type="submit"
        >
          Einloggen
        </ion-button>
      </ion-item>
    </form>
    <form @submit="signUp($event)" v-else class="ion-padding">
      <ion-item>
        <ion-label position="stacked">E-Mail</ion-label>
        <ion-input
          type="email" required name="email" v-model="input.email" placeholder="affinity@gmail.com" />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Username</ion-label>
        <ion-input type="text" required name="username" v-model="input.username" placeholder="username" />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input type="password" required name="password" v-model="input.password" placeholder="Password" />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Name</ion-label>
        <ion-input type="text" name="name" v-model="input.name" placeholder="" />
      </ion-item>
      <div class="ion-text-end">
        <ion-button fill="outline" color="primary" type="submit">
          Registrieren
        </ion-button>
      </div>
    </form>
  </ion-content>
</template>

<script lang="ts">
import {
  IonHeader, IonToolbar, IonIcon, IonItem, IonContent, IonInput,
  IonButton, IonLabel, IonSegment, IonSegmentButton,
  alertController, toastController,
} from '@ionic/vue';
import {
  closeOutline as closeIcon
} from 'ionicons/icons';
import { defineComponent } from 'vue';
import { Parse } from "../config/Consts";

export default defineComponent({
  name: 'Login',
  emits: ['route', 'user-updated', 'close'],
  components: {
    IonHeader, IonToolbar, IonIcon,
    IonItem, IonContent, IonInput, IonButton, IonLabel,
    IonSegment, IonSegmentButton,
  },
  props: {
    withCloser: Boolean,
  },
  data() {
    return {
      action: "login",
      input: {
        username: "",
        email: "",
        name: "",
        password: ""
      },
      error: {
        code: 0,
        message: ""
      }
    }
  },
  setup() {
    return {
      closeIcon,
    }
  },
  methods: {
    resetError(){
      this.error.code = 0;
      this.error.message = "";
    },
    switchAction(a: string){
      this.resetError();
      this.action = a;
    },
    async passwortReset() {
      const value = this.input.username.includes("@") ? this.input.username : this.input.email;
      const alert = await alertController
        .create({
          header: 'Passwort zurücksetzten!',
          message: 'Wie lautet die registrierte E-Mail?',
          inputs: [
            {
              name: "email",
              type: "email",
              label: "E-Mail",
              value
            },
          ],
          buttons: [
            {
              text: 'Passwort zurücksetzten',
              handler: async (data) => {
                const { email } = data;

                await Parse.User.requestPasswordReset(email
                ).then(async () => {
                  const toast = await toastController
                    .create({
                      message: 'Passwort Reset E-Mail verschickt 📨. Bitte prüfe deinen Posteingang 📬',
                      duration: 10000,
                      color: "success",
                    })
                  return toast.present();
                }, err => {
                  this.error.code = err.code;
                  this.error.message = err.message;
                });
              },
            },
            {
              text: 'Abbrechen',
              role: 'cancel',
              cssClass: 'medium',
            },
          ],
        });
      return alert.present();
    },
    signUp(event: Event) {
      event.preventDefault();
      this.resetError();

      Parse.User.signUp(this.input.username, this.input.password, {
        name: this.input.name, email: this.input.email
      }, {}).then(async (resp) => {
        console.log('Logged in successfully', resp);

        // Clears up the form
        this.input.username = '';
        this.input.password = '';
        this.$emit("user-updated", resp);

        this.$emit("route", "Home");
      }, err => {
        this.error.code = err.code;
        this.error.message = err.message;
      });
    },
    login(event: Event) {
      event.preventDefault();
      this.resetError();
      Parse.User.logIn(this.input.username, this.input.password).then((resp) => {
        console.log(resp);
        this.$emit("user-updated", resp);
        this.$emit("route", "Home");
      }, err => {
        this.error.code = err.code;
        this.error.message = err.message;
      });
    }
  }
})
</script>
<style scoped>
.warning {
  background: var(--ion-color-warning);
}
</style>