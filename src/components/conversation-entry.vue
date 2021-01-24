<template>
    <template v-if="isSharedInbox">
        <div slot="start" class="avatar-wrap">
            <div v-if="showTeam">
                <avatar :profile="team" :name="teamName"/>
            </div>
            <avatar v-else :profile="convo.participants[0]" />
        </div>
        <ion-label>
            <h2 v-if="showTeam">
                {{convo.team.name}}
            </h2>
            <h2 v-else>
                {{convo.participants[0].name}}
            </h2>
            <p v-if="!brief">{{msgPreview}}</p>
        </ion-label>
        <div v-if="!brief" class="ion-text-right" slot="end">
            <ion-note color="medium">{{when}}</ion-note><br/>
            <ion-badge color="danger">3</ion-badge>
        </div>
    </template>
</template>
<script lang="ts">
import {
    IonLabel, IonBadge, IonNote,
} from '@ionic/vue';
import { since } from "../utils/time";

// import {
// } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from '../stores/';
import Avatar from "./avatar.vue";

export default defineComponent({
  name: 'conversation-entry',
  props: {
    convo: {
      type: Object,
      required: true
    },
    brief: Boolean,
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
    when(): string {
        const msg = this.convo.latestMessage;
        if (!msg) {
            return ""
        }
        return since(msg.createdAt)
    },
    teamName(): string { return this.convo.team.name },
    isSharedInbox(): boolean { return this.convo.type == "sharedInbox" },
    team(): any { return this.convo.team },
    showTeam(): boolean {
        return this.isMe(this.convo.participants[0].id)
    },
    msgPreview(): string {
        const msg = this.convo.latestMessage;
        if (!msg) {
            return ""
        }

        const author = msg.author;
        const name = author.name || author.username || author;
        return `${name}: ${msg.text}`
    },
  }
});
</script>