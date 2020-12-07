<template>
  <ion-app>
    <ion-content>
      <h1>Hello</h1>
    </ion-content>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp, IonRouterOutlet, IonTabs, IonFooter, IonContent, IonProgressBar, getPlatforms
} from '@ionic/vue';
import { defineComponent } from 'vue';

// import SideMenu from '../components/side-menu.vue';
import { Parse } from "./Consts";

export default defineComponent({
  name: 'Widget',
  components: {
    IonApp,
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
<style scoped>
  affinity-chat-widget {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
</style>