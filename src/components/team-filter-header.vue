<template>
  <ion-header v-if="showTabs">
    <ion-toolbar>
      <ion-segment data-cy="team-filter" scrollable @click="$emit('team-selected', $event.target.value)">
        <ion-segment-button
          v-for="entry in visibleTabs"
          :value="entry.value"
          :key="entry.value"
          :data-cy-entry="entry.team  ? entry.team.slug : entry.value"
          >
          <avatar
            size="1.8rem"
            v-if="entry.team"
            :profile="entry.team"
            :with-name="showName"
          />
          <template v-else>
            <ion-icon :icon="entry.icon" />
              <ion-label class="ion-margin-start" v-if="showName">{{entry.title}}</ion-label>
          </template>
        </ion-segment-button>

        <ion-segment-button
          data-cy-entry="settings"
          @click="openSettings($event)">
          <ion-icon :icon="settingIcon"></ion-icon>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import {
  modalController,
  IonHeader,
  IonToolbar,
  IonSegment,
  IonLabel,
  IonIcon,
  IonSegmentButton,
} from '@ionic/vue';
import { cogOutline as settingIcon,globeOutline as globeIcon } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import EditTeamFilter from "../components/edit-team-filter.vue";
import Avatar from "@/components/avatar.vue";
import { useStore } from '../stores/';

const DEFAULT_SETTINGS: any = {
  showName: true,
  tabs: []
}


export default defineComponent({
  name: 'TeamFilterHeader',
  emits: ['team-selected'],
  setup() {
    const store = useStore();
    return {
      myTeams: computed(() => store.getters["auth/myTeams"]),
      settings: computed(() => (store.getters["auth/settings"].teamTabs || DEFAULT_SETTINGS)),
      teamsMap: computed(() => store.getters.objectsMap),
      settingIcon,
      store,
      globeIcon
    }
  },
  computed: {
    showTabs(): boolean {
      return (this.tabs || []).length > 0
    },
    showName(): boolean {
      return this.settings.showName
    },
    tabs(): any[] {
      let tabs = this.settings.tabs || [];
      if (!tabs.length && this.myTeams.length > 1) {
        // nothing configured but more than one team available, switching to default
        tabs = [{default: 'all', show: true}];
        this.myTeams.forEach((team:any) => {
          tabs.push({show: true, value: team.objectId, team: team.objectId})
        });
      } else if (tabs.length > 0) {
        const teamIds = tabs.map((e:any) => e.team);
        this.myTeams.filter(
          (team:any) => teamIds.indexOf(team.objectId) === -1
        ).forEach((team:any) => {
          // let's add all the other teams by default
          tabs.push({show: true, value: team.objectId, team: team.objectId})
        });
      }
      return tabs;
    },
    visibleTabs(): any[] {
      const res = this.tabs
        .filter((t:any) => t.show)
        .map((e:any) => Object.assign({}, e, e.team ? {team: this.teamsMap[e.team]} : this.remap(e.default)));
      return  res;
    }
  },
  methods:{
    remap(e: string): any {
      const REMAP_DEFAULTS: Record<string, any> = {
        'all': {
          value: "ALL", icon: globeIcon, title: this.$t("teamFilter.all")
        }
      }
      return REMAP_DEFAULTS[e]
    },
    async openSettings(e: Event) {
      e.preventDefault();

      const modal = await modalController
        .create({
          component: EditTeamFilter,
          componentProps: {
            remap: (x: string) => this.remap(x),
            currentSettings: {
              showName: this.showName,
              tabs: this.tabs,
            },
            allTeams: this.myTeams
          },
      });
      await modal.present();
      const res = await modal.onDidDismiss();
      if (res.data) {
        await this.store.dispatch("auth/setSetting", {teamTabs: res.data})
      }
    }
  },
  components: {
   IonHeader,
   IonToolbar,
   IonSegment,
   IonLabel,
   IonIcon,
   IonSegmentButton,
   Avatar,
  }
});
</script>

<style scoped>
</style>