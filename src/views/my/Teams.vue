<template>
  <ion-page>
    <ion-content data-cy="myTeams">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button />
          </ion-buttons>
          <ion-label><i18n-t keypath="menu.myTeams"/></ion-label>
        </ion-toolbar>
      </ion-header>
      <div class="wrap">
        <ion-card
          v-for="team in teams"
          :key="team.id"
          button
          @click="$router.push({ name: 'ViewTeam', params: {teamSlug: team.slug} })"
          data-cy-role="teamLink"
          :data-cy-team="team.slug"
        >
          <profile-card
            :profile="team"
            :can-edit="false"
            :show-qr="false"
            :show-menu="false"
          />
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonButtons,
  IonCard,
} from '@ionic/vue';
// import {
//   } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '@/stores/';
import ProfileCard from "@/components/profile-card.vue";

export default defineComponent({
  name: 'MyTeams',
  setup() {
    const store = useStore();
    return {
      teams: computed(() => store.getters["auth/myTeams"]),
      store,
    }
  },
  mounted() {
    //
  },
  methods:{
  },
  components: {
    IonContent,
    IonCard,
    IonPage,
    IonBackButton,
    IonToolbar,
    IonHeader,
    IonLabel,
    IonButtons,
    ProfileCard,
  }
});
</script>
