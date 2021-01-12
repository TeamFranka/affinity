import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { isPlatform } from '@ionic/core';
import News from '../views/News.vue';
import Inbox from '../views/Inbox.vue';
import CommunityOutlet from '../views/CommunityOutlet.vue';
import Feed from '../views/Feed.vue';
import Faq from '../views/FAQ.vue';
import Me from '../views/Me.vue';
import Donations from '../views/Donations.vue';
import ViewTeam from '../views/ViewTeam.vue';
import ViewActivity from '../views/ViewActivity.vue';
import ViewConversation from '../views/ViewConversation.vue';
import { store } from '../stores/';

const ensureLoggedIn = (to: any, from: any, next: any) => {
  if (store.getters["auth/isLoggedIn"]) {
    return next()
  } else {
    store.dispatch("auth/openLogin", {to, from, next});
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/inbox/:conversationId',
    name: 'Conversation',
    component: ViewConversation,
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: Inbox,
    beforeEnter: ensureLoggedIn
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: Faq
  },
  {
    path: '/me',
    name: 'Me',
    component: Me,
    beforeEnter: ensureLoggedIn
  },
  {
    path: '/donate',
    name: 'Donations',
    component: Donations
  },
  {
    path: '/',
    name: "CommunityOutlet",
    component: CommunityOutlet,
    children: [
      {
        path: 't/:teamSlug',
        name: 'ViewTeam',
        component: ViewTeam
      },
      {
        path: 'a/:activityId',
        name: 'ViewActivity',
        component: ViewActivity
      },
      {
        path: 'feed',
        name: 'Feed',
        component: Feed
      },
      {
        path: '/',
        redirect: isPlatform('desktop') ? "/feed" : "/news"
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((_to, _from, next) => {
  store.dispatch("routingStart");
  next()
})

router.afterEach((to, from) => {
  store.dispatch("routingEnd");
})


export default router
