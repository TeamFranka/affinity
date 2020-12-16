// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { Parse } from './config/Consts';

// define your typings for the store state
export interface State {
  user: Parse.User | null;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    user: null
  },
  mutations: {
    setUser(state: State, newUser: Parse.User|null) {
      console.debug("Setting user to", newUser);
      state.user = newUser
    }
  },
  actions: {
    fetchUser(context) {
      Parse.User.currentAsync().then(user => {
          console.log('Userobject', user);
          context.commit("setUser", user);
        }, err => {
          console.error('Error getting logged user', err);
        }
      );
    }
  }
})


// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}
