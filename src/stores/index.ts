import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { GlobalStateT, GlobalState } from './globals';
import { AuthStateT, AuthState } from './auth';

export interface State {
  global: GlobalStateT;
  auth: AuthStateT;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules:{
    global: GlobalState,
    auth: AuthState
  }
})

export function useStore () {
  return baseUseStore(key)
}
