import { InjectionKey } from "vue";
import {
  createStore,
  Store,
  useStore as baseUseStore,
  createLogger,
} from "vuex";

import { GlobalStateT, GlobalState } from "./globals";
import { AuthStateT, AuthState } from "./auth";
import { FeedT, Feed } from "./feed";
import { NewsT, News } from "./news";
import { InboxT, Inbox } from "./inbox";
import { FaqT, Faq } from "./faq";
import { TeamsT, Teams } from "./teams";
import { CommentsT, Comments } from "./comments";
import { DraftT, Draft } from "./draft";

export interface State {
  global: GlobalStateT;
  comments: CommentsT;
  auth: AuthStateT;
  news: NewsT;
  faq: FaqT;
  inbox: InboxT;
  teams: TeamsT;
  draft: DraftT;
  feed: FeedT;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const plugins = process.env.NODE_ENV === "development" ? [createLogger()] : [];

export const store = createStore<State>({
  plugins,
  modules: {
    global: GlobalState,
    comments: Comments,
    news: News,
    faq: Faq,
    teams: Teams,
    feed: Feed,
    inbox: Inbox,
    draft: Draft,
    auth: AuthState,
  },
});

export function useStore() {
  return baseUseStore(key);
}
