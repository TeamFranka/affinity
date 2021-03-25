<template>
  <div class="chat-widget">
    <transition name="fade">
      <div v-if="open" class="chat-window">
        <component
          :is="currentComponent"
          @user-update="userUpdated($event)"
          @route="route($event)"
          @select-chat="selectChat($event)"
          :user="user"
          :convos="convos"
          :loadingConvos="loadingConvos"
          :community="community"
        ></component>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="open" class="messengers">
        <ion-button color="secondary" size="small"
          ><ion-icon :icon="logoTelegram"></ion-icon
        ></ion-button>
        <ion-button color="secondary" size="small"
          ><ion-icon :icon="logoWhatsapp"></ion-icon
        ></ion-button>
        <ion-button color="secondary" size="small"
          ><ion-icon :icon="logoFacebook"></ion-icon
        ></ion-button>
        <ion-button color="secondary" size="small"
          ><ion-icon :icon="logoInstagram"></ion-icon
        ></ion-button>
        <ion-button color="secondary" size="small"
          ><ion-icon :icon="logoTwitter"></ion-icon
        ></ion-button>
      </div>
    </transition>
    <ion-button
      @click="open = !open"
      class="chat-action"
      :style="config.extraButtonCSS"
    >
      <ion-badge />
      <ion-icon v-if="open" name="close"></ion-icon>
      <ion-icon v-if="!open" name="chatbubbles-outline"></ion-icon>
    </ion-button>
  </div>
</template>

<script lang="ts">
import { IonIcon, IonBadge, IonButton } from "@ionic/vue";

import {
  chatbubbles,
  logoFacebook,
  logoTwitter,
  logoInstagram,
  paperPlaneOutline,
  logoWhatsapp,
} from "ionicons/icons";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Icons from "ionicons/icons";
import Home from "../views/ChatWidgetHome.vue";
import Login from "../components/login.vue";
import { defineComponent } from "vue";

// import SideMenu from '../components/side-menu.vue';
import { Parse, Conversation, ChatWidgetSettings } from "../config/Consts";

export default defineComponent({
  name: "chat-widget",
  props: {
    config: {
      type: ChatWidgetSettings,
      required: true,
    },
  },
  data() {
    return {
      currentComponent: "Home",
      loadingConvos: false,
      convos: [],
      selectedChatId: "",
      user: {},
      open: false,
    };
  },
  components: {
    Home,
    Login,
    IonIcon,
    IonBadge,
    IonButton,
  },
  setup(props) {
    const chatIcon = props.config.buttonIcon || "chatbubbles";
    return {
      chatbubbles,
      logoFacebook,
      logoTwitter,
      logoInstagram,
      logoWhatsapp,
      logoTelegram: paperPlaneOutline,
      chatIcon,
    };
  },
  methods: {
    route(path: string) {
      this.currentComponent = path;
    },
    userUpdated(user: any) {
      this.user = user;
    },
    selectChat(chat: any) {
      console.log("selecting", chat);
    },
  },
  computed: {
    community(): any {
      return this.config.team;
    },
  },
  mounted() {
    Parse.User.currentAsync().then(
      (user) => {
        if (user) {
          this.user = user;
          this.loadingConvos = true;
          const query = new Parse.Query(Conversation).addDescending(
            "updatedAt"
          );
          query.find().then((convos: any) => {
            this.convos = convos;
            this.loadingConvos = false;
          });
        } else {
          this.loadingConvos = false;
        }
      },
      (err) => {
        console.log("Error getting logged user", err);
      }
    );
  },
});
</script>
<style scoped>
.chat-action,
.messengers > ion-button,
.chat-window {
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
  padding-right: 10px;
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
.chat-window ion-card-content {
  height: 400px;
  max-height: 90vh;
}
</style>
