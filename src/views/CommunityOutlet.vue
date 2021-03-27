<template>
  <ion-page>
    <ion-split-pane content-id="main">
      <!--  the community side menu  -->
      <ion-menu content-id="main" side="start" class="ion-padding">
        <ion-content>
          <ion-list lines="none">
            <ion-item-group>
              <ion-item
                ><router-link :to="{ name: 'News' }"
                  ><ion-icon :icon="homeIcon" />
                  {{ $t("menu.news") }}</router-link
                ></ion-item
              >
              <ion-item
                ><router-link :to="{ name: 'FAQ' }"
                  ><ion-icon :icon="faqIcon" />
                  {{ $t("menu.info") }}</router-link
                ></ion-item
              >
              <ion-item
                ><router-link :to="{ name: 'Feed' }"
                  ><ion-icon :icon="feedIcon" />
                  {{ $t("menu.feed") }}</router-link
                ></ion-item
              >
              <ion-item v-if="false"
                ><router-link :to="{ name: 'News' }"
                  ><ion-icon :icon="activitiesIcon" />
                  {{ $t("menu.activities") }}</router-link
                ></ion-item
              >
              <ion-item>
                <router-link :to="{name: 'Gallery'}"
                ><ion-icon :icon="galleryIcon" />
                 {{ $t('menu.picture') }}</router-link
                ></ion-item>
              
            </ion-item-group>
            <ion-item-group v-if="showTeamSubmenu">
              <ion-item-divider>
                <ion-label>{{ $t("menu.myTeams") }}</ion-label>
              </ion-item-divider>
              <ion-item v-for="t in teams" :key="t.objectId">
                <router-link
                  :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
                >
                  <avatar :profile="t" :name="t.name" size="25px" withName />
                </router-link>
                <div slot="end">
                  <router-link
                    :to="{ name: 'ViewTeam', params: { teamSlug: t.slug } }"
                    ><ion-icon :icon="settingsIcon"
                  /></router-link>
                </div>
              </ion-item>
            </ion-item-group>
          </ion-list>
        </ion-content>
        <ion-footer class="ion-padding">
          <inline-link-list
            style="--menu-color: var(--ion-color-tertiary)"
            :items="socialLinks"
            showIcon
          />
          <inline-link-list
            style="--menu-color: var(--ion-color-medium)"
            :items="footerLinks"
            showTitle
          />
        </ion-footer>
      </ion-menu>
      <ion-router-outlet id="main" />
    </ion-split-pane>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonRouterOutlet,
  IonIcon,
  IonMenu,
  IonList,
  IonItem,
  IonFooter,
  IonSplitPane,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
} from "@ionic/vue";
import {
  newspaperOutline as homeIcon,
  bonfireOutline as activitiesIcon,
  peopleCircleOutline as feedIcon,
  settingsOutline as settingsIcon,
  addCircleOutline,
  chatbubbleEllipsesOutline,
  fileTrayFullOutline,
  imageOutline as galleryIcon,
  personCircleOutline,
  compassOutline as faqIcon,
  walletOutline,
} from "ionicons/icons";
import { useStore } from "../stores/";
import { defineComponent, computed } from "vue";
import InlineLinkList from "../components/generic/inline-link-list.vue";
import Avatar from "../components/avatar.vue";

export default defineComponent({
  name: "CommunityOutlet",

  setup() {
    const store = useStore();
    return {
      homeIcon,
      feedIcon,
      activitiesIcon,
      settingsIcon,
      donationsIcon: walletOutline,
      faqIcon,
      teams: computed(() => store.getters["auth/myTeams"]),
      defaultTeam: computed(() => store.getters["defaultTeam"]),
      showTeamSubmenu: computed(() => {
        if (store.getters["auth/hasManyTeams"]) {
          return true;
        }

        return store.getters["auth/adminOfTeams"].length > 0;
      }),
      postIcon: addCircleOutline,
      chatIcon: fileTrayFullOutline,
      newChatIcon: chatbubbleEllipsesOutline,
      meIcon: personCircleOutline,
      galleryIcon,
    };
  },
  computed: {
    socialLinks(): any[] {
      return this.defaultTeam?.socialLinks;
    },
    footerLinks(): any[] {
      return this.defaultTeam?.footerLinks;
    },
  },
  components: {
    Avatar,
    InlineLinkList,
    IonPage,
    IonContent,
    IonRouterOutlet,
    IonIcon,
    IonMenu,
    IonList,
    IonItem,
    IonFooter,
    IonSplitPane,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
  },
});
</script>
<style scoped>
ion-split-pane {
  --border: unset;
}
a {
  text-decoration: none;
  color: var(--ion-color-medium);
}
.router-link-active {
  text-decoration: none;
  color: var(--ion-color-primary);
}
</style>
