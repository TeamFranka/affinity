<template>
  <ion-page>
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

    <ion-content data-cy="activity-feed">
      <div class="wrap">
        <ion-card v-if="canPost">
          <ion-card-content>
            <new-post :teams="canPostInTeams" />
          </ion-card-content>
        </ion-card>
        <ion-spinner v-if="loading" name="dots"></ion-spinner>

        <transition-group name="list">
          <activity
            v-for="activity in latestPosts"
            :showTeam="showTeams"
            :activity="activity"
            :key="activity.objectId"
          />
        </transition-group>
      </div>
      <ion-infinite-scroll
        @ionInfinite="loadMore($event)"
        threshold="5%"
      >
        <ion-infinite-scroll-content
          loading-spinner="crescent"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonContent, IonSpinner, IonCard, IonCardContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  modalController
} from '@ionic/vue';
import { chatbubbles, heartOutline, addOutline, mailOutline, caretForwardOutline,cogOutline as settingIcon } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import EditTeamFilter from "../components/edit-team-filter.vue";
import { useStore } from '../stores/';
import Activity from "../components/activity.vue";
import NewPost from "../components/new-post.vue";

export default defineComponent({
  name: 'Feed',
  data(){
    const teamId: any ='';
    const newTeamArray: string[] = [];
    const latestPosts: any[]=[];
    const allPosts: any='';
    return{
      teamId,
      newTeamArray,
      latestPosts,
      allPosts
    }
  },
  
  setup() {
    const store = useStore();
    return {
      canPostInTeams: computed(() => store.getters["auth/postableTeamIds"].map((id: string)=> store.getters.objectsMap[id])),
      canPost: computed(() => store.getters["auth/postableTeamIds"].length > 0),
      teamName: computed(() => store.getters["auth/myTeams"]),
      loading: computed(() => store.state.feed.loading),
      canLoadMore: computed(() => store.getters["feed/canLoadMore"]),
      // latestPosts: (() => store.getters["feed/latestPosts"]),
      showTeams: computed(() => store.getters["auth/myTeams"].length > 1),
      loadMore: (ev: CustomEvent) => {
        console.log("we should load more", ev);
        store.dispatch("feed/loadMore").then(() => {(ev.target as any).complete()})
      },

      chatbubbles, like: heartOutline, mail: mailOutline, plus: addOutline,settingIcon,
      teamSplitter: caretForwardOutline, store
    }
  },
   created: function(){
        this.getSettings();
        setTimeout(()=>{
           this.getPosts();
        },1000)     
    }, 
 
  methods:{ 
      getPosts(){      
          this.latestPosts = this.store.getters["feed/latestPosts"];
          this.allPosts = this.latestPosts;
      },
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
          
            this.allPosts.map((data: any)=>{if(data.team.name === val){newPostArray.push(data)}})   
            this.latestPosts = newPostArray     
            return  this.latestPosts; 
          }         
        }
      }
  },
  components: {
    IonContent, IonPage, IonSpinner, IonCard, IonCardContent,
    IonInfiniteScroll, IonInfiniteScrollContent,
    NewPost, Activity
  }
});
</script>

<style scoped>
ion-card img.image {
  width: 100%;
}

ion-card-header {
  display: flex;
  align-content: center;
}
ion-card-header ion-avatar {
  height: 3em;
  width: 3em;
}
ion-card-header ion-label {
  padding-left: 1em;
}
.segment-block{
  display: flex;
  align-items: center;
}
.segment-block ion-avatar {
  width: 1.5rem;
  height: 1.5rem;
}
</style>


