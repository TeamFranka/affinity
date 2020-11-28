<template>
  <ion-app>
    <side-menu></side-menu>
    <div class="ion-page" id="main-content">
      <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-buttons slot="end">
                <user-icon v-bind:user="user"></user-icon>
            </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-router-outlet />
    </div>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonHeader, IonContent, IonToolbar, IonIcon, IonButtons,
  IonList, IonMenu, IonMenuButton, IonAvatar,
  getPlatforms
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Parse from 'parse';

import SideMenu from './components/side-menu.vue';
import UserIcon from './components/user-icon.vue';

Parse.initialize("pJ63XHNU3C14XQpdLVYDbQR3mSU4aye4LQhxap3R", "73v5ZKTHd2Wxl71zJv7NiWXLbZlZXwnESZhCUtcH");
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.enableEncryptedUser();
Parse.enableLocalDatastore();


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonMenuButton,
    UserIcon,
    SideMenu,
    IonToolbar,
    IonButtons,
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
      console.log('Error getting logged user');
      this.user = {avatar: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" };
    });

    const install = new Parse.Installation();
    install.set("deviceType", getPlatforms().toString());

    install.save(null, {
      success: (install: any) => {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + install.id);
      },
      error: (install: any, error: any) => {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log('Failed to create new object, with error code:' + error.message.toString());
      }
    });
    console.log("mounted");
  }
});
</script>