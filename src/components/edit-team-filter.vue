<template>
<ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-button class="closeIcon" color="dark" fill="clear" @click="closeModal" slot="start">
              <ion-icon :icon="closeIcon" />
            </ion-button>
            
            <ion-title>Edit Team Filter</ion-title>
            <ion-buttons slot="end" class="ion-padding" @click="saveAndClose">
              <ion-text color="primary">Save</ion-text>
            </ion-buttons>
          </ion-toolbar>
      </ion-header>

      <ion-content>

        <ion-item lines="none">
            <ion-toggle  @ionChange="showTeamName($event)"
            value="displayName" color="primary"></ion-toggle>
            <ion-label>Show Team Names</ion-label>
        </ion-item> 
        
        <ion-item>
            <ion-toggle  @ionChange="allCheck($event)" v-model="isAllSelected"
              value="all" color="primary"></ion-toggle>
            <ion-label>All</ion-label>
        </ion-item>
      <ion-reorder-group reorder="true" @ionItemReorder="doReorder($event)" disabled="false" v-if="initalTeam.length!==0">

         <ion-item  v-for="(item,index) in initalTeam || []" :key="index">
              <ion-toggle v-if="item.name" slot="start"  @ionChange="toggleHandler($event)"
            :value="item.name" color="primary" :checked="item.toggle" v-model="item.toggle"></ion-toggle>

              <ion-avatar v-if="item.icon!==''" size="1.5rem">
                <img v-bind:src="item.icon" />
            </ion-avatar>
           
            <ion-label class="ion-margin-start">{{item.name}}</ion-label>
            <ion-reorder></ion-reorder>
            
        </ion-item>

      </ion-reorder-group>
</ion-content>
</ion-page>
</template>


<script lang="ts">
import {
 IonLabel, IonItem, IonToggle,modalController
} from '@ionic/vue';
import {
   closeOutline as closeIcon,
} from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from '../stores/';
import { ItemReorderEventDetail } from '@ionic/core';
export default defineComponent({
  name: 'EditTeamFilter',
  props: {
    teamDetails: {
      type: Array,
      required: true
    }
  },
  data() {
      const initalTeam: any[] = [];
      let tempArr: any = '';
      const newTeamArray: string[] = [];
      const isAllSelected: any = false;
      const isShowName: any = false;
     
      this.teamDetails.map((data: any)=>{
        const obj = {'name':data.name,'icon':data.avatar.url,'toggle':false,'priority':null,'isIcon':true}
        initalTeam.push(obj)
      });
      tempArr= initalTeam
    
      return{
          initalTeam,
          newTeamArray,
          isAllSelected,
          isShowName,
          tempArr
      }
  },
 
  setup(){  
    const store = useStore();  
    return {  
      store,
      closeModal() {
        modalController.dismiss()
      },
      closeIcon
    }
    
  },
  mounted: function(){
        this.getSettings();
    },
  methods :{
      getSettings(){
      const teamPriority: any =  this.store.state.auth.user;
      this.newTeamArray = [];
      if(teamPriority.settings!==undefined && teamPriority.settings!==null){
        if(teamPriority.settings.feedTabs!==undefined && teamPriority.settings.feedTabs!==null){
          teamPriority.settings.feedTabs.map((data: any)=>this.newTeamArray.push(data))
          this.initalTeam = teamPriority.settings.feedTabs;
          this.initalTeam.sort((a: any,b: any) => a.priority-b.priority);
        }
      }  
      },
      showTeamName(event: any){
        if(event.detail.checked){
          this.isShowName = true;
        }
        else{
          this.isShowName = false;
        }
      },
      allCheck(event: any){
         if(event.detail.checked){
              this.isAllSelected = true;
              this.initalTeam.filter(data=>data.toggle=true);
          }
          else{
            this.isAllSelected = false;
            this.initalTeam.filter(data=>data.toggle=false);
          }
      },
      toggleHandler(event: any){
           
          const value = event.detail.value;
         
          if(event.detail.checked){
              this.initalTeam.find((data: any)=>{if(data.name == value) {
                data.toggle = true;
              } })            
          }
          else{
              const index: number = this.initalTeam.findIndex((data: any)=>data.name==value)
              if(index>=0){
                this.initalTeam[index].toggle = false 
              }
          }
      },
      doReorder(ev: CustomEvent<ItemReorderEventDetail>){ 
        ev.detail.complete();
       
          this.initalTeam[ev.detail.from].priority = ev.detail.to+1,
          this.initalTeam[ev.detail.to].priority = ev.detail.from+1;
       
      },
   
      saveAndClose() {
        let res: any= []
 
        if(this.isShowName){
          this.initalTeam.filter((item: any)=>item.isIcon=false)
          res = this.initalTeam
        }
        else{
          this.initalTeam.filter((item: any)=>item.isIcon=true)
          res = this.initalTeam       
        }
        
        this.store.dispatch('auth/setSetting', { 'feedTabs': res});
        modalController.dismiss(res);
    },
  },
  components: {
    IonLabel, IonItem, IonToggle
  }
});
</script>

<style scoped>
   
    ion-content{
        height: 100vh;
    }
</style>