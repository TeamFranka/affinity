<template>
<ion-header>
    <ion-toolbar>
      <ion-segment scrollable @click="teamSelected($event)"  v-if ="newTeamArray.length==0">
         <ion-segment-button value="all">
          <ion-label>All</ion-label>
        </ion-segment-button>
        <ion-segment-button  v-for="item in teamName" :key="item.objectId" :value="item.name">
          <ion-label>{{item.name}}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="setting">
          <ion-icon :icon="settingIcon"></ion-icon>
        </ion-segment-button>
      </ion-segment>

      <!-- When setting data set -->
      <ion-segment scrollable @click="teamSelected($event)"  v-if ="newTeamArray.length!=0">
          <ion-segment-button value="all">
          <ion-label>All</ion-label>
        </ion-segment-button>

        <ion-list v-for="(item, index) in newTeamArray" v-bind:index="item.priority" :key="index" :value="item.name">
        <ion-segment-button v-if="item.toggle">
          <div class="segment-block">
          <ion-avatar v-if="item.isIcon && item.icon!==''" size="1.5rem" slot="start">
                <img v-bind:src="item.icon" />
            </ion-avatar>
            <ion-label class="ion-margin-start">{{item.name}}</ion-label>
          </div>
        </ion-segment-button>
        </ion-list>
        <ion-segment-button value="setting">
          <ion-icon :icon="settingIcon"></ion-icon>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { modalController } from '@ionic/vue';
import { cogOutline as settingIcon } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import EditTeamFilter from "../components/edit-team-filter.vue";
import { useStore } from '../stores/';

export default defineComponent({
  name: 'TeamFilterHeader',
  data(){
    const newTeamArray: string[] = [];
    const latestPosts: any[] =[];
    return{
      newTeamArray,
      latestPosts
    }
  },
  
  setup() {
    const store = useStore();
    return {
      teamName: computed(() => store.getters["auth/myTeams"]),    
      settingIcon,store
    }
  },
   created: function(){
        this.getSettings();   
    }, 
 
  methods:{ 
 
    getSettings(){
      const teamPriority: any =  this.store.state.auth.user;
      this.newTeamArray = [];
      if(teamPriority.settings!==undefined && teamPriority.settings!==null){
        if(teamPriority.settings.feedTabs!==undefined && teamPriority.settings.feedTabs!==null){
          teamPriority.settings.feedTabs.map((data: any)=>this.newTeamArray.push(data))
          this.newTeamArray.sort((a: any,b: any) => a.priority-b.priority);
        }
      }
    },
    async teamSelected(event: any){     
        const val = event.target.value;
        if(val == "setting"){
           const modal = await modalController
          .create({
            component: EditTeamFilter,
            componentProps: {
              teamDetails : this.teamName
            },
            })
            await modal.present();
            const res = await modal.onDidDismiss();
            if (res.data) {
              this.getSettings();
            }
          }
        else{
          if(val=="all"){
            this.latestPosts = this.store.getters["feed/latestPosts"];
            return  this.latestPosts
          }
          else{
            const newPostArray: any[] = [];
          
            // this.allPosts.map((data: any)=>{if(data.team.name === val){newPostArray.push(data)}})   
            // this.latestPosts = newPostArray     
            // return  this.latestPosts; 
          }         
        }
      }
  },
  components: {
   
  }
});
</script>

<style scoped>
.segment-block{
  display: flex;
  align-items: center;
}
.segment-block ion-avatar {
  width: 1.5rem;
  height: 1.5rem;
}
</style>