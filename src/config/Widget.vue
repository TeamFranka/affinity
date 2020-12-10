<template>
  <div  class="chat-widget">
    <transition name="fade">
      <div v-if="open" class="chat-window">
        <component
          :is="currentComponent"
          @user-update="userUpdated($event)"
          @route="route($event)"
          v-bind:user="user"
        ></component>
      </div>
    </transition>
    <transition  name="fade">
      <div v-if="open" class="messengers">
        <ion-button color="secondary" size="small"><ion-icon :icon="logoTelegram"></ion-icon></ion-button>
        <ion-button color="secondary" size="small"><ion-icon :icon="logoWhatsapp"></ion-icon></ion-button>
        <ion-button color="secondary" size="small"><ion-icon :icon="logoFacebook"></ion-icon></ion-button>
        <ion-button color="secondary" size="small"><ion-icon :icon="logoInstagram"></ion-icon></ion-button>
        <ion-button color="secondary" size="small"><ion-icon :icon="logoTwitter"></ion-icon></ion-button>
      </div>
    </transition>
    <ion-button @click="open = !open" class="chat-action">
      <ion-badge />
      <ion-icon v-if="!open" :icon="chatbubbles"></ion-icon>
      <ion-icon v-if="open" :icon="close"></ion-icon>
    </ion-button>
  </div>
</template>

<script lang="ts">

import {
  IonIcon,
  IonBadge,
  IonButton,
} from '@ionic/vue';

import {
  chatbubbles, logoFacebook, logoTwitter, logoInstagram, paperPlaneOutline, logoWhatsapp, closeOutline
} from 'ionicons/icons';
import Home from '../views/ChatWidgetHome.vue';
import Login from '../views/Login.vue';
import { defineComponent } from 'vue';

// import SideMenu from '../components/side-menu.vue';
import { Parse } from "./Consts";

export default defineComponent({
  name: 'x-affinity-chat-widget',
  data() {
    return {
      currentComponent: "Home",
      user: {},
      open: false
    }
  },
   components: {
    Home,
    Login,
    IonIcon,
    IonBadge,
    IonButton,
  },
  setup() {
    return {
      chatbubbles, logoFacebook, logoTwitter, logoInstagram,  logoWhatsapp,
      logoTelegram: paperPlaneOutline, close: closeOutline
    }
  },
  methods: {
    route(path: string) {
      this.currentComponent = path;
    },
    userUpdated(user: any) {
      this.user = user;
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
      this.user = { avatar: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" };
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
  .chat-action, .messengers > ion-button, .chat-window {
    border-radius: 0.5em;
    box-shadow: 0px 0px 3px #999;
  }
  .messengers > ion-button {
    display: inline-block;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 40px;
    height: 40px;
  }
  .chat-action {
    border-radius: 10px;
    display: inline-block;
    width: 56px;
    height: 56px;
    font-size: 14px;
    text-align: center;
  }
  .chat-widget {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
  .messengers {
    display: inline-block;
    padding-top: 5px;
    padding-right: 10px
  }
  .messengers ion-button {
    border-radius: 100%;
    margin-right: 0.1rem;
    overflow: hidden;
    text-align: center;
  }
  .chat-window {
    margin: 0;
    position: absolute;
    right: 0;
    bottom: 4.5rem;
    width: 300px;
    height: 450px;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .chat-window header {
    background: #0a0;
    color: white;
    padding: 0 1em;
  }
  .chat-window section {
    padding: 1em;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-content: center;
  }
  .chat-window
  ion-card-content {
    height: 400px;
    max-height: 90vh;
  }
</style>