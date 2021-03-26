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
import { useStore } from "../stores";

export default defineComponent({
  name: "Login",
  mounted() {
    const store = useStore();
    const r: any = this.$route;
    const forward = () => this.$router.replace(r.params.next || "/");

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
