<template>
  <ion-app>
    <ion-progress-bar color="secondary" type="indeterminate"></ion-progress-bar>
    <ion-content>
      <user-icon v-bind:user="user"></user-icon>
      <ion-router-outlet />
    </ion-content>
    <ion-footer>
      <footer-menu />
    </ion-footer>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonTabs, IonFooter, IonContent, IonProgressBar, getPlatforms
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Parse from 'parse';

import SideMenu from './components/side-menu.vue';
import FooterMenu from './components/footer-menu.vue';
import UserIcon from './components/user-icon.vue';

Parse.initialize("pJ63XHNU3C14XQpdLVYDbQR3mSU4aye4LQhxap3R", "73v5ZKTHd2Wxl71zJv7NiWXLbZlZXwnESZhCUtcH");
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.enableEncryptedUser();
Parse.enableLocalDatastore();

const __VERSION = "0.0.1";
const __DEFAULT_COMMUNITY = "Hl37IXIrXm";


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonProgressBar,
    IonFooter,
    UserIcon,
    IonContent,
    FooterMenu,
    // SideMenu,
    // IonToolbar,
    // IonButtons,
  },
  data() {
    return {
      result: "loading",
      user: {},
      }
  },
  mounted() {
    Parse.User.currentAsync().then(user => {
      console.log('Logged user', user);
      if (user) {
        this.user = user;
      } else {
        this.user = { avatar: "https://gnunicorn.org/assets/images/ben.png" };
      }
    }, err => {
      console.log('Error getting logged user', err);
      this.user = {avatar: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" };
    });

    // const install = new Parse.Installation();
    // install.set("deviceType", getPlatforms().toString());
    // install.set("appName", "affinity");
    // install.set("appVersion", __VERSION);
    // // install.set("parseVersion", Parse.version);

    // install.save(null, {
    //   success: (install: any) => {
    //     // Execute any logic that should take place after the object is saved.
    //     console.log('New object created with objectId: ' + install.id);
    //   },
    //   error: (install: any, error: any) => {
    //     // Execute any logic that should take place if the save fails.
    //     // error is a Parse.Error with an error code and message.
    //     console.log('Failed to create new object, with error code:' + error.message.toString());
    //   }
    // });
    console.log("mounted");
  }
});
</script>