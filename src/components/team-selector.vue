<template>
  <selector
    label="Team"
    popoverTitle="Team"
    @select="emit('selectTeam', $event)"
    :items="teams"
    data-cy="selectTeam"
  >
    <template #current>
      <avatar v-if="selectedTeam" :profile="selectedTeam" size="2em" :withName="currentShowName" />
    </template>
    <template #item="sProps">
      <ion-item @click="sProps.select(sProps.item)" button>
        <avatar :profile="sProps.item" size="2em" withName />
        <ion-icon
          v-if="sProps.item.objectId == team.objectId"
          slot="end"
          :icon="selectedIcon"
        />
      </ion-item>
    </template>
  </selector>
</template>
<script lang="ts">
import Avatar from "./avatar.vue";
import Selector from "@/components/generic/selector.vue";
import {
  IonItem,
  IonIcon,
} from "@ionic/vue";

import {
  checkmarkOutline as selectedIcon,
} from "ionicons/icons";
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    teams: {
      type: Array,
      required: true
    },
    selectedTeam: {
    },
    currentShowName: {
      type: Boolean
    }
  },
  setup() {
    return {
      selectedIcon,
    }
  },
  components: {
    Selector,
    Avatar,
    IonItem,
    IonIcon,
  }
})
</script>
