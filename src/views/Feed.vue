<template>
  <ion-page>
    <ion-content fullscreen>
      <ion-toggle color="light">Posts only</ion-toggle>

      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/women/29.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Luca<ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/picsum/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/men/29.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Luca<ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/men/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/women/11.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Luca</h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/kretschmer/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/women/10.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Luca</h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/franka/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/women/2.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Luca</h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/arte/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/women/12.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Lucy</h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/sada/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


      <ion-card>
        <ion-card-header>
          <ion-avatar>
            <img src="https://randomuser.me/api/portraits/men/10.jpg">
          </ion-avatar>
          <ion-label>
            <h2>Mika<ion-icon :icon="teamSplitter" /> <a href="">TeamFranka</a></h2>
            <ion-note color="medium">21:12</ion-note>, #goals, #nowMoreThanEver
          </ion-label>
        </ion-card-header>
        <ion-img class="image" src="https://picsum.photos/seed/sari/300/200" />
        <ion-card-content>
          <ion-icon :icon="chatbubbles" /> 12 <ion-icon :icon="like" /> 23 <ion-icon :icon="plus" />
        </ion-card-content>
      </ion-card>


    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonCard,IonCardContent, IonCardHeader, IonImg,
  IonToggle, IonIcon, IonAvatar, IonLabel, IonNote,
} from '@ionic/vue';
import { chatbubbles, heartOutline, addOutline, mailOutline, caretForwardOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'Inbox',
  setup() {
    return {
      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,
      teamSplitter: caretForwardOutline,
    }
  },
  components: {
    IonContent, IonPage, IonAvatar, IonCard, IonCardContent, IonCardHeader, IonImg,
    IonToggle, IonLabel, IonIcon, IonNote,
  }
});
</script>

<style scoped>
ion-card img.image {
  width: 100%;
}

ion-card-header {
  display: flex;
  align-content: center;
}
ion-card-header ion-avatar {
  height: 3em;
  width: 3em;
}
ion-card-header ion-label {
  padding-left: 1em;
}
</style>