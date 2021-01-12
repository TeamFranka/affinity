<template>
    <template v-if="isSharedInbox">
        <div slot="start" class="avatar-wrap">
            <div v-if="showTeam">
                <avatar :profile="teamSettings" :name="teamName"/>
            </div>
            <avatar v-else :profile="convo.get('participants')[0]" />
        </div>
        <ion-label>
            <h2 v-if="showTeam">
                {{convo.get('team').get('name')}}
            </h2>
            <h2 v-else>
                {{convo.get("participants")[0].get('name')}}
            </h2>
            <p>{{msgPreview}}</p>
        </ion-label>
        <div class="ion-text-right" slot="end">
            <ion-note color="medium">{{when}}</ion-note><br/>
            <ion-badge color="danger">3</ion-badge>
        </div>
    </template>
</template>
<script lang="ts">
import {
    IonChip, IonIcon, IonAvatar, IonLabel, IonBadge, IonNote,
} from '@ionic/vue';
import { since } from "../utils/time";

// import {
// } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { Parse } from "../config/Consts";
import { useStore } from '../stores/';
import Avatar from "./avatar.vue";

export default defineComponent({
  name: 'conversation-entry',
  props: {
    convo: {
      type: Parse.Object,
      required: true
    }
  },
  components: {
    Avatar,
    IonLabel, IonNote, IonBadge,
  },
  setup() {
    const store = useStore();
    return {
      isMe: (id: string) => store.getters["auth/myId"] == id,
        store
    }
  },
  computed: {
    when():     string {
        const msg = this.convo.get("latestMessage");
        if (!msg) {
            return ""
        }
        return since(msg.get("createdAt"))
    },
    teamName(): string { return this.convo.get("team").get("name") },
    isSharedInbox(): boolean { return this.convo.get("type") == "sharedInbox" },
    teamSettings(): Parse.Object { return this.convo.get("team").get("settings") },
    showTeam(): boolean {
        return this.isMe(this.convo.get('participants')[0].id)
    },
    msgPreview(): string {
        const msg = this.convo.get("latestMessage");
        if (!msg) {
            return ""
        }

        const author = msg.get("author");
        const name = author.get("name") || author.get("username") || author;
        return `${name}: ${msg.get("text")}`
    },
  }
});
</script>