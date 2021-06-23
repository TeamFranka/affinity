import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { isPlatform } from "@ionic/core";
import News from "@/views/News.vue";
import App from "@/views/App.vue";
import Inbox from "@/views/Inbox.vue";
import CommunityOutlet from "@/views/CommunityOutlet.vue";
import Feed from "@/views/Feed.vue";
import WelcomePage from "@/views/WelcomePage.vue";
import Faq from "@/views/FAQ.vue";
import My from "@/views/my/Main.vue";
import Bookmarks from "@/views/my/Bookmarks.vue";
import MyTeams from "@/views/my/Teams.vue";
import Login from "@/views/Login.vue";
import Donations from "@/views/Donations.vue";
import ViewTeam from "@/views/ViewTeam.vue";
import ViewActivity from "@/views/ViewActivity.vue";
import ViewUser from "@/views/ViewUser.vue";
import ViewConversation from "@/views/ViewConversation.vue";
import Settings from "@/views/settings/Center.vue";
import SettingsGeneral from "@/views/settings/General.vue";
import Gallery from "@/views/Gallery.vue";
import SettingsNotifications from "@/views/settings/Notifications.vue";
import { store } from "@/stores/";

const ensureLoggedIn = (to: any, from: any, next: any) => {
  if (store.getters["auth/isLoggedIn"]) {
    next();
  } else {
    next({ name: "Login", params: { next: to.fullPath } });
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/inbox/:conversationId",
    name: "Conversation",
    component: ViewConversation,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/inbox",
    name: "Inbox",
    component: Inbox,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/donate",
    name: "Donations",
    component: Donations,
  },
  {
    path: "/my",
    name: "Me",
    component: My,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/my/bookmarks",
    name: "Bookmarks",
    component: Bookmarks,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/my/teams",
    name: "MyTeams",
    component: MyTeams,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/settings/notifications",
    name: "SettingsNotifications",
    component: SettingsNotifications,
  },
  {
    path: "/settings/general",
    name: "SettingsGeneral",
    component: SettingsGeneral,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: "/settings/",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: WelcomePage,
  },
  {
    path: "/a/:activityId",
    name: "ViewActivity",
    component: ViewActivity,
  },
  {
    path: "/t/:teamSlug",
    name: "ViewTeam",
    component: ViewTeam,
    children: [],
  },
  {
    path: "/",
    name: "CommunityOutlet",
    component: CommunityOutlet,
    children: [
      {
        path: "/app",
        name: "App",
        component: App,
      },
      {
        path: "/faq",
        name: "FAQ",
        component: Faq,
      },
      {
        path: "/news",
        name: "News",
        component: News,
      },
      {
        // FIXME: support username-based URLs
        path: "u/:userId",
        name: "ViewUser",
        component: ViewUser,
      },
      {
        path: "feed",
        name: "Feed",
        component: Feed,
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: Gallery
      },
      {
        path: "/",
        redirect: () => {
          if (store.getters["auth/isLoggedIn"]) {
            return "/feed";
          }
          return isPlatform("desktop") ? "/feed" : "/news";
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((_to, _from, next) => {
  store.dispatch("routingStart");
  next();
});

router.afterEach(() => {
  store.dispatch("routingEnd");
});

export default router;
