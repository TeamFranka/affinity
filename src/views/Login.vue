<template>
  <ion-page>
    <ion-content>
      <div class="ion-padding ion-text-center">
        <p>
          <img style="width: 45vw" src="../statics/undraw_authentication.svg" />
        </p>
        <ion-note>{{ $t("login.loginRequired") }}</ion-note>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonNote } from "@ionic/vue";
import { defineComponent, watch } from "vue";
import { Parse } from "@/config/Consts";
import { DEBUG } from "@/utils/env";
import { useStore } from "@/stores";

export default defineComponent({
  name: "Login",
  mounted() {
    const store = useStore();
    const r: any = this.$route;
    const next = r.params.next || r.query.next || "/";
    const forward = () => this.$router.replace(next);

    console.log("YAY", DEBUG, r.query.username)

    // FOR TESTING PURPOSE ONLY.
    if (DEBUG && r.query.username) {
      const username = r.query.username;
      Parse.User.logIn(username, username).then((newUser) => {
        store.dispatch("auth/loggedIn", newUser);
      });
    }

    if (store.getters["auth/isLoggedIn"]) {
      forward();
    } else {
      watch(
        () => store.state.auth.user,
        async (newVal: any) => {
          if (newVal) {
            forward();
          }
        }
      );
      store.dispatch("auth/openLogin");
    }
  },
  components: {
    IonPage,
    IonContent,
    IonNote,
  },
});
</script>
<style scoped></style>
