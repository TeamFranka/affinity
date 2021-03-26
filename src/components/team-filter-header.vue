<template>
  <ion-header v-if="showTabs">
    <ion-toolbar>
      <ion-segment scrollable @click="teamSelected($event)">
        <ion-segment-button
          v-for="entry in visibleTabs"
          :value="entry.value"
          :key="entry.value"
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

        <ion-segment-button value="__setting">
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
      settings: computed(() =>  (((store.state.auth.user || {}) as any).settings || {
        teamTabs: DEFAULT_SETTINGS })
      ),
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
      let tabs = this.settings.tabs;
      if (!tabs && this.myTeams.length > 1) {
        // nothing configured but more than one team available, switching to default
        tabs = [{
          value: null, icon: globeIcon, title: this.$t("teamFilter.all"), show: true
        }];
        this.myTeams.forEach((team:any) => {
          tabs.push({team, show: true, value: team.objectId})
        });
      }
      return tabs;
    },
    visibleTabs(): any[] {
      return this.tabs.filter((t:any) => t.show);
    }
  },
  methods:{
    async teamSelected(event: any) {
        const val = event.target.value;
        if (val == "__setting") {
           const modal = await modalController
          .create({
            component: EditTeamFilter,
            componentProps: {
              currentSettings: {
                withName: this.settings.withName,
                tabs: this.tabs,
              },
              allTeams: this.myTeams
            },
            })
            await modal.present();
            const res = await modal.onDidDismiss();
            if (res.data) {
              await this.store.dispatch("auth/setSetting", {teamTabs: res.data})
            }
          }
        else{
          this.$emit('team-selected', val)
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