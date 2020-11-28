<template>
  <ion-app>
    <ion-menu side="start" content-id="main-content">
      <ion-header>
        <ion-toolbar translucent>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-icon name="mail" slot="start"></ion-icon>
            <ion-label>Inbox</ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="paper-plane" slot="start"></ion-icon>
            <ion-label>Outbox</ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="heart" slot="start"></ion-icon>
            <ion-label>Favorites</ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="archive" slot="start"></ion-icon>
            <ion-label>Archived</ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="trash" slot="start"></ion-icon>
            <ion-label>Trash</ion-label>
          </ion-item>
          <ion-item>
            <ion-icon name="warning" slot="start"></ion-icon>
            <ion-label>Spam</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-popover
      :is-open="isOpenRef"
      css-class="my-custom-class"
      :event="event"
      :translucent="true"
      @onDidDismiss="setOpen(false)"
    >
      <Popover></Popover>
    </ion-popover>

    <div class="ion-page" id="main-content">
      <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
          <ion-title slot="primary">{{result}}</ion-title>
            <ion-buttons slot="end">
                <ion-avatar>
                  <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
                </ion-avatar>
            </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-router-outlet />
    </div>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonHeader, IonContent, IonLabel, IonItem, IonTitle, IonToolbar, IonIcon, IonButtons,
  IonList, IonMenu, IonMenuButton, IonAvatar,
  getPlatforms
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Parse from 'parse';

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
    IonMenu, IonList, IonLabel, IonItem, IonMenuButton,
    IonAvatar,
    IonContent,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButtons,
  },
  data() {
    return {
      result: "loading",
      user: null,
      }
  },
  mounted() {
    Parse.User.currentAsync().then(user => {
      console.log('Logged user', user);
    }, err => {
      console.log('Error getting logged user');
    })

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