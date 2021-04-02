<template>
  <ion-header>
    <ion-toolbar>
      <ion-segment
        :value="action"
        @ion-change="switchAction($event.target.value)"
      >
        <ion-segment-button data-cy="loginTab" value="login">
          <ion-label>{{ $t("auth.tab.login") }}</ion-label>
        </ion-segment-button>
        <ion-segment-button data-cy="registerTab" value="register">
          <ion-label>{{ $t("auth.tab.register") }}</ion-label>
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
    <h4 v-if="action == 'login'">{{ $t("auth.title.login") }}</h4>
    <h4 v-else>{{ $t("auth.title.registry") }}</h4>

    <div v-if="error.code" class="warning ion-padding">
      <template v-if="error.code == 101">
        <strong>{{ $t("auth.error.wrongPassword.title") }}</strong>
        <i18n-t keypath="auth.error.wrongPassword" tag="span">
          <template v-slot:registerButton>
            <ion-button
              fill="clear"
              type="a"
              @click="switchAction('register')"
              >{{ $t("auth.error.wrongPassword.registerButton") }}</ion-button
            >
          </template>
          <template v-slot:resetButton>
            <ion-button fill="clear" type="a" @click="passwortReset">{{
              $t("auth.error.wrongPassword.resetButton")
            }}</ion-button>
          </template>
        </i18n-t>
      </template>
      <template v-else-if="error.code == 202">
        <i18n-t keypath="auth.error.userExists" tag="p">
          <template v-slot:resetLink>
            <a href="/">{{ $t("auth.error.userExists.resetLink") }}</a>
          </template>
        </i18n-t>
      </template>
      <template v-else-if="error.code == 203">
        <i18n-t keypath="auth.error.emailExists" tag="p">
          <template v-slot:resetLink>
            <a href="/">{{ $t("auth.error.emailExists.resetLink") }}</a>
          </template>
        </i18n-t>
      </template>
      <template v-else>
        {{ error.message }} <i>Code: {{ error.code }}</i>
      </template>
    </div>

    <form @submit="login($event)" v-if="action == 'login'" class="ion-padding">
      <ion-item class="ion-hide-sm-down">
        <ion-input
          type="text"
          required
          name="username"
          v-model="input.username"
          :placeholder="$t('auth.placeholder.usernameEmail')"
        />
        <ion-input
          type="password"
          required
          name="password"
          v-model="input.password"
          :placeholder="$t('auth.placeholder.password')"
        />
      </ion-item>
      <ion-item class="ion-hide-sm-up">
        <ion-input
          type="text"
          required
          name="username"
          v-model="input.username"
          :placeholder="$t('auth.placeholder.usernameEmail')"
        />
      </ion-item>
      <ion-item class="ion-hide-sm-up">
        <ion-input
          type="password"
          required
          name="password"
          v-model="input.password"
          :placeholder="$t('auth.placeholder.password')"
        />
      </ion-item>
      <ion-item lines="none">
        <ion-button
          @click="passwortReset"
          slot="end"
          fill="none"
          color="medium"
          class="ion-hide-sm-down"
        >
          {{ $t("auth.button.resetPassword") }}
        </ion-button>
        <ion-button
          data-cy-role="loginSubmit"
          size="normal"
          slot="end"
          fill="outline"
          color="primary"
          type="submit"
        >
          {{ $t("auth.button.login") }}
        </ion-button>
      </ion-item>
      <ion-item class="ion-hide-sm-up" lines="none">
        <ion-button @click="passwortReset" slot="end" fill="none" color="light">
          {{ $t("auth.button.resetPassword") }}
        </ion-button>
      </ion-item>
    </form>
    <form @submit="signUp($event)" v-else class="ion-padding">
      <ion-item>
        <ion-label position="stacked">{{ $t("auth.label.email") }}</ion-label>
        <ion-input
          type="email"
          required
          name="email"
          v-model="input.email"
          placeholder="affinity@example.org"
        />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{
          $t("auth.label.username")
        }}</ion-label>
        <ion-input
          type="text"
          required
          name="username"
          v-model="input.username"
          :placeholder="$t('auth.placeholder.username')"
        />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{
          $t("auth.label.password")
        }}</ion-label>
        <ion-input
          type="password"
          required
          name="password"
          v-model="input.password"
          :placeholder="$t('auth.placeholder.password')"
        />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{ $t("auth.label.name") }}</ion-label>
        <ion-input
          type="text"
          name="name"
          v-model="input.name"
          placeholder=""
        />
      </ion-item>
      <div class="ion-text-end">
        <ion-button
          fill="outline"
          color="primary"
          type="submit"
          data-cy-role="registerSubmit"
        >
          {{ $t("auth.button.register") }}
        </ion-button>
      </div>
    </form>
  </ion-content>
</template>

<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonItem,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  alertController,
  toastController,
} from "@ionic/vue";
import { closeOutline as closeIcon } from "ionicons/icons";
import { defineComponent } from "vue";
import { Parse } from "../config/Consts";

export default defineComponent({
  name: "Login",
  emits: ["route", "user-updated", "close"],
  components: {
    IonHeader,
    IonToolbar,
    IonIcon,
    IonItem,
    IonContent,
    IonInput,
    IonButton,
    IonLabel,
    IonSegment,
    IonSegmentButton,
  },
  props: {
    withCloser: Boolean,
    signupExtra: Object,
  },
  data() {
    return {
      action: "login",
      input: {
        username: "",
        email: "",
        name: "",
        password: "",
      },
      error: {
        code: 0,
        message: "",
      },
    };
  },
  setup() {
    return {
      closeIcon,
    };
  },
  methods: {
    resetError() {
      this.error.code = 0;
      this.error.message = "";
    },
    switchAction(a: string) {
      this.resetError();
      this.action = a;
    },
    async passwortReset() {
      const value = this.input.username.includes("@")
        ? this.input.username
        : this.input.email;
      const alert = await alertController.create({
        header: this.$t("auth.reset.header"),
        message: this.$t("auth.reset.message"),
        inputs: [
          {
            name: "email",
            type: "email",
            label: this.$t("auth.reset.label.email"),
            value,
          },
        ],
        buttons: [
          {
            text: this.$t("auth.reset.button.submitReset"),
            handler: async (data) => {
              const { email } = data;

              await Parse.User.requestPasswordReset(email).then(
                async () => {
                  const toast = await toastController.create({
                    message: this.$t("auth.reset.success"),
                    duration: 10000,
                    color: "success",
                  });
                  return toast.present();
                },
                (err) => {
                  this.error.code = err.code;
                  this.error.message = err.message;
                }
              );
            },
          },
          {
            text: this.$t("auth.reset.button.cancel"),
            role: "cancel",
            cssClass: "medium",
          },
        ],
      });
      return alert.present();
    },
    signUp(event: Event) {
      event.preventDefault();
      this.resetError();
      const attrs = Object.assign({}, this.signupExtra, {
        name: this.input.name,
        email: this.input.email,
      });

      Parse.User.signUp(
        this.input.username,
        this.input.password,
        attrs,
        {}
      ).then(
        async (resp) => {
          // Clears up the form
          this.input.username = "";
          this.input.password = "";
          this.$emit("user-updated", resp);

          this.$emit("route", "Home");
        },
        (err) => {
          this.error.code = err.code;
          this.error.message = err.message;
        }
      );
    },
    login(event: Event) {
      event.preventDefault();
      this.resetError();
      Parse.User.logIn(this.input.username, this.input.password).then(
        (resp) => {
          this.$emit("user-updated", resp);
          this.$emit("route", "Home");
        },
        (err) => {
          this.error.code = err.code;
          this.error.message = err.message;
        }
      );
    },
  },
});
</script>
<style scoped>
.warning {
  background: var(--ion-color-warning);
}
</style>
