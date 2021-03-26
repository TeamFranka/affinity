<template>
  <div slot="start" class="avatar-wrap">
    <div v-if="showTeam">
      <avatar :profile="team" :name="teamName" />
    </div>
    <avatar v-else :profile="convo.participants[0]" />
  </div>
  <ion-label :data-cy="convoKey">
    <h2>
      {{ convoName }}
    </h2>
    <p v-if="!brief">{{ msgPreview }}</p>
  </ion-label>
  <div v-if="false && !brief" class="ion-text-right" slot="end">
    <ion-note color="medium">{{ when }}</ion-note
    ><br />
    <ion-badge color="danger">3</ion-badge>
  </div>
</template>
<script lang="ts">
import { IonLabel, IonBadge, IonNote } from "@ionic/vue";
import { since } from "../utils/time";

// import {
// } from 'ionicons/icons';
import { defineComponent } from "vue";
import { useStore } from "../stores/";
import Avatar from "./avatar.vue";

export default defineComponent({
  name: "conversation-entry",
  props: {
    convo: {
      type: Object,
      required: true,
    },
    brief: Boolean,
  },
  components: {
    Avatar,
    IonLabel,
    IonNote,
    IonBadge,
  },
  setup(props: any) {
    const store = useStore();
    console.log(props.convo);
    return {
      isMe: (id: string) => store.getters["auth/myId"] == id,
      store,
    };
  },
  computed: {
    when(): string {
      const msg = this.convo.latestMessage;
      if (!msg) {
        return "";
      }
      return since(msg.createdAt);
    },
    convoKey(): string {
      if (this.isTeamChat) {
        return `teamchat-${this.convo.team.slug}-${this.convo.among}`;
      } else if (this.isSharedInbox) {
        return `sharedinbox-${this.convo.team.slug}-${this.convo.participants[0].username}`;
      } else {
        return this.team.name;
      }
    },
    convoName(): string {
      if (this.isTeamChat) {
        return this.$t(`conversation.title.${this.convo.among}`, {
          teamName: this.convo.team.name,
        });
      } else if (this.isSharedInbox) {
        return this.convo.participants[0].name;
      } else {
        return this.team.name;
      }
    },
    teamName(): string {
      return this.convo.team.name;
    },
    isSharedInbox(): boolean {
      return this.convo.type == "sharedInbox";
    },
    isTeamChat(): boolean {
      return this.convo.type == "team";
    },
    team(): any {
      return this.convo.team;
    },
    showTeam(): boolean {
      return !(
        this.isSharedInbox && this.isMe(this.convo.participants[0].objectId)
      );
    },
    msgPreview(): string {
      const msg = this.convo.latestMessage;
      if (!msg) {
        return "";
      }

      const author = msg.author;
      const name = author.name || author.username || author;
      return `${name}: ${msg.text}`;
    },
  },
});
</script>
