import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { GlobalStateT, GlobalState } from './globals';
import { AuthStateT, AuthState } from './auth';
import { FeedT, Feed } from './feed';
import { NewsT, News } from './news';
import { CommentsT, Comments } from './comments';
import { DraftT, Draft } from './draft';

export interface State {
  global: GlobalStateT;
  comments: CommentsT;
  auth: AuthStateT;
  news: NewsT;
  draft: DraftT;
  feed: FeedT;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules:{
    global: GlobalState,
    comments: Comments,
    news: News,
    feed: Feed,
    draft: Draft,
    auth: AuthState,
  }
})

export function useStore () {
  return baseUseStore(key)
}
