<template>
  <ion-page>
    <ion-content>
      <h1>{{ $t("appPage.title") }}</h1>
      <p>
        {{ $t("appPage.intro") }}
      </p>
      <p>
        {{ $t("appPage.explainer") }}
      </p>
      <ion-row>
        <ion-col>
          {{ $t("appPage.title.forAndroid") }}
          <qrcode :text="androidLink" :logo="androidLogo" />
          <ion-button fill="outline" :href="androidLink">{{
            $t("appPage.button.android")
          }}</ion-button>
        </ion-col>
        <ion-col>
          {{ $t("appPage.title.foriOS") }}
          <qrcode :text="iosLink" :logo="iosLogo" />
          <ion-button fill="outline" :href="iosLink">{{
            $t("appPage.button.iOS")
          }}</ion-button>
        </ion-col>
      </ion-row>
      <p>{{ $t("appPage.updates") }}</p>
      <i18n-t tag="p" keypath="appPage.support">
        <template slot:link>
          <a href="https://franka.jetzt">franka.jetzt</a>
        </template>
      </i18n-t>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ANDROID_INSTALL_URL, IOS_INSTALL_URL } from "@/config/Consts";
import { IonPage, IonContent, IonRow, IonCol, IonButton } from "@ionic/vue";
import Qrcode from "@/components/qrcode.vue";

export default {
  name: "AppInstall",
  components: { IonContent, IonPage, IonRow, IonCol, IonButton, Qrcode },

  setup() {
    return {
      iosLogo: require("@/statics/logos/ios.png"),
      androidLogo: require("@/statics/logos/android.png"),
      iosLink: IOS_INSTALL_URL,
      androidLink: ANDROID_INSTALL_URL,
    };
  },
};
</script>
<style scoped>
ion-row {
  text-align: center;
}
</style>
