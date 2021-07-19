<template>
  <ion-page>
    <ion-content>
      <ion-list>
        <ion-list-header>
          <ion-segment @ion-change="switchTabs" :value="selectedSegment">
            <ion-segment-button value="convos">
              <ion-label>{{ $t("inbox.tabs.conversation") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="notifications">
              <ion-label
                >{{ $t("inbox.tabs.notifications")
                }}{{
                  unreadNotifications.length > 0
                    ? `&nbsp;(${unreadNotifications.length})`
                    : ""
                }}</ion-label
              >
            </ion-segment-button>
          </ion-segment>
        </ion-list-header>

        <template v-if="selectedSegment == 'convos'">
          <ion-spinner v-if="loading" />
          <div
            class="ion-padding ion-text-center"
            v-if="!loading && convos.length == 0"
          >
            <p>
              <img style="width: 45vw" src="../statics/undraw_empty.svg" />
            </p>
            <ion-note>{{ $t("inbox.state.noConversation") }}</ion-note>
          </div>
          <ion-item
            button
            details="false"
            @click="selectConversation(convo.objectId)"
            v-for="convo in convos"
            :key="convo.objectId"
            lines="inset"
          >
            <conversation-entry :convo="convo" />
          </ion-item>
        </template>
        <template v-else>
          <ion-spinner v-if="loading" />
          <div
            class="ion-padding ion-text-center"
            v-if="!loading && notifications.length == 0"
          >
            <p>
              <img style="width: 45vw" src="../statics/undraw_empty.svg" />
            </p>
            <ion-note>{{ $t("inbox.state.noNotifications") }}</ion-note>
          </div>
          <ion-item
            :href="linkTo(n)"
            detail="false"
            v-for="n in notifications"
            :key="n.objectId"
            lines="inset"
            v-bind:class="{ unread: unreadNotifications.includes(n) }"
          >
            <avatar size="2em" :profile="n.by" />
            <ion-label>
              <div class="ion-padding-start">
                <div>
                  {{ n.by.name || n.by.username }}
                  <span v-if="n.verb == 'react'">
                    {{ $t("inbox.notifications.reacted") }}
                    &nbsp;{{ (n.specifics || {})["reaction"] }}
                  </span>
                  <span v-else-if="n.verb == 'like'">
                    {{ $t("inbox.notifications.liked") }}
                  </span>
                  <span v-else-if="n.verb == 'comment'">
                    {{ $t("inbox.notifications.commented") }}
                  </span>
                </div>
              </div>
              <p class="ion-padding-start">
                {{ n.objects[0].text }}
              </p>
              <p v-if="n.verb == 'comment'" class="ion-padding-start">
                {{
                  n.objects.find((object) => object.className === "Comment")
                    .text
                }}
              </p>
            </ion-label>
            <span class="meta" slot="end">{{
              smartTimestamp(n.createdAt)
            }}</span>
          </ion-item>
        </template>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonListHeader,
  IonItem,
  IonSpinner,
  IonNote,
} from "@ionic/vue";
import {
  chatbubbles,
  logoWhatsapp,
  folderOpenOutline,
  mailOutline,
} from "ionicons/icons";
import { defineComponent, computed } from "vue";
import ConversationEntry from "../components/conversation-entry.vue";
import Avatar from "../components/avatar.vue";
import { useStore } from "../stores/";
import { smartTimestamp } from "../utils/time";

export default defineComponent({
  name: "Inbox",
  data() {
    return {
      selectedSegment: "convos",
    };
  },
  setup() {
    const store = useStore();
    return {
      smartTimestamp,
      loading: computed(() => store.getters["inbox/loading"]),
      refresh() {
        store.dispatch("inbox/refresh");
      },
      convos: computed(() => store.getters["inbox/latest"]),
      notifications: computed(() => store.getters["inbox/notifications"]),
      unreadNotifications: computed(
        () => store.getters["inbox/unreadNotifications"]
      ),
      chatbubbles,
      logoWhatsapp,
      isNew: folderOpenOutline,
      mail: mailOutline,
      store: store,
    };
  },
  methods: {
    selectConversation(conversationId: string) {
      this.$router.push({ name: "Conversation", params: { conversationId } });
    },
    switchTabs(event: any) {
      const selectedSegment = event.target.value;
      this.selectedSegment = selectedSegment;

      if (selectedSegment === "notifications") {
        this.store.dispatch("inbox/markNotificationsRead");
      }
    },
    linkTo(notification: any) {
      const id = notification.objects
        .map((object: any) =>
          object.className === "Comment" ? object.on.objectId : object.objectId
        )
        .find(Boolean);
      return `/a/${id}`;
    },
  },
  mounted() {
    if (!this.loading && this.convos.length === 0) {
      this.refresh();
    }
  },
  components: {
    IonContent,
    IonPage,
    IonSpinner,
    IonNote,
    ConversationEntry,
    Avatar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonListHeader,
    IonItem,
  },
});
</script>

<style scoped>
.meta {
  font-size: 0.8em;
  color: var(--ion-color-medium);
}

.unread {
  --background: var(--ion-color-primary);
}
</style>
