<template>
    <ion-chip
        outline
        v-for="r in reactions"
        :disabled="!canReact"
        :color="r.selected ? this.selectedColor : this.unselectedColor"
        :key="r.key"
        @click="r.selected ? this.unreact(r.key) : r.react(r.key)"
    >
      <ion-label>{{r.key}}</ion-label>
      <ion-label>{{r.count}}</ion-label>
    </ion-chip>
    <ion-chip v-if="canReact" outline color="light">
      <ion-icon :icon="plusIcon" size="small"/>
    </ion-chip>
</template>
<script lang="ts">
import {
  IonChip, IonLabel, IonIcon
} from '@ionic/vue';
import { addOutline as plusIcon } from 'ionicons/icons';
import { Parse } from '../config/Consts';
import { useStore } from '../stores/';
import { defineComponent } from 'vue';

interface ReactionState {
    key: string;
    selected: boolean;
    count: number;
}

export default defineComponent({
  name: 'Activity',
  emits: ['react', 'unreact'],
  components: {
    IonChip, IonLabel, IonIcon,
  },
  props: {
      selectedColor: {
        type: String,
        default: 'dark'
      },
      unselectedColor: {
        type: String,
        default: 'light'
      },
      item: {
        type: Parse.Object,
        required: true
      }
  },
  setup() {
    const store = useStore();
    return {
      store,
      plusIcon,
    };
  },
  computed: {
    reactions(): ReactionState[] {
      const reacts: Record<string, string[]> = this.item.get("reactions") || {};
      const myId = this.store.getters["auth/myId"] || "";

      return Object.entries(reacts || {}).map(([key, reactors]) => {
        return {
          key,
          selected: reactors.indexOf(myId) !== -1,
          count: reactors.length
        }
      });
    },
    pointer(): Parse.Pointer {
      return this.item.toPointer()
    },
    canReact(): boolean {
      const team = this.item.get("team");
      const settings = this.store.getters["auth/teamPermissions"][team.id];
      return settings ? settings.canReact : false;
    },
  },
  methods: {
    react(reaction: string) {
      this.store.dispatch("auth/react", Object.assign({reaction}, this.pointer));
    },
    unreact(reaction: string) {
      this.store.dispatch("auth/unreact", Object.assign({reaction}, this.pointer));
    },
  }
})
</script>
<style scoped>

</style>