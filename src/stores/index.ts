import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { AuthStateT, AuthState } from './auth';

export interface State {
  auth: AuthStateT;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules:{
    auth: AuthState
  }
})

export function useStore () {
  return baseUseStore(key)
}
