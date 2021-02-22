<template>
  <ion-page>
    <ion-content>
      <h1>Jetzt auf dem Smartphone installieren!</h1>
      <p>
        Nun endlich gibt es die TeamFranka Community auch als App für das Smartphone,
        bisher aber noch in einer nicht über die App-Stores verfügbaren Beta-Version.
      </p>
      <p>
        Um diese zu installieren einfach den passenden QR-Code mit deinem Smartphone scannen, oder auf dem Smartphone den passenden Button klicken, und auf der folgenden Seite dann auf "download".
        Wenn die App herunter geladen wurde, diese ganz normal öffnen – euer Smartphone wird euch zwar warnen, dass diese Datei nicht bekannt sei, sollte aber nach eurem Einverständnis die Installation fortsetzten.
      </p>
      <ion-row>
        <ion-col>
          Für Android:
          <qrcode :text="androidLink" :logo="androidLogo" />
          <ion-button fill="outline" :href="androidLink">Android Version</ion-button>
        </ion-col>
        <ion-col>
          Für's iPhone/iPad:
          <qrcode :text="iosLink" :logo="iosLogo" />
          <ion-button fill="outline" :href="iosLink">iOS Version</ion-button>
        </ion-col>
      </ion-row>
      <p>Grundsätzlich aktualisiert sich die App auch von selbst, sollte es dennoch einmal Probleme geben, die App einfach über das System-Menu deinstallieren und über diese Webseite erneut die neueste Version herunterladen und installieren.
      </p>
      <p>Bei Fragen oder Probleme, gerne über <a href="https://franka.jetzt">franka.jetzt</a> den Kontakt aufnehmen!.</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ANDROID_INSTALL_URL, IOS_INSTALL_URL } from '@/config/Consts';
import { IonPage, IonContent, IonRow, IonCol, IonButton } from '@ionic/vue';
import Qrcode from '@/components/qrcode.vue';

export default  {
  name: 'AppInstall',
  components: { IonContent, IonPage, IonRow, IonCol, IonButton, Qrcode },

  setup() {
      return {
          iosLogo: require('@/statics/logos/ios.png'),
          androidLogo: require('@/statics/logos/android.png'),
          iosLink: IOS_INSTALL_URL,
          androidLink: ANDROID_INSTALL_URL,
      }
  }
}
</script>
<style scoped>
ion-row {
  text-align: center;
}
</style>