import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { isPlatform } from '@ionic/core';
import News from '../views/News.vue';
import Inbox from '../views/Inbox.vue';
import CommunityOutlet from '../views/CommunityOutlet.vue';
import Feed from '../views/Feed.vue';
import Faq from '../views/FAQ.vue';
import Me from '../views/Me.vue';
import Login from '../views/Login.vue';
import Donations from '../views/Donations.vue';
import ViewTeam from '../views/ViewTeam.vue';
import ViewActivity from '../views/ViewActivity.vue';
import ViewUser from '../views/ViewUser.vue';
import ViewConversation from '../views/ViewConversation.vue';
import { store } from '../stores/';

const ensureLoggedIn = (to: any, from: any, next: any) => {
  if (store.getters["auth/isLoggedIn"]) {
    next()
  } else {
    next({ name: 'Login' , params: {next: to.fullPath}});
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/inbox/:conversationId',
    name: 'Conversation',
    component: ViewConversation,
    beforeEnter: ensureLoggedIn,
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: Inbox,
    beforeEnter: ensureLoggedIn,
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
        path: '/faq',
        name: 'FAQ',
        component: Faq
      },
      {
        path: '/news',
        name: 'News',
        component: News
      },
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
        // FIXME: support username-based URLs
        path: 'u/:userId',
        name: 'ViewUser',
        component: ViewUser
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
