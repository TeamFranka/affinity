<template>
<ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-button class="closeIcon" color="dark" fill="clear" @click="closeModal" slot="start">
              <ion-icon :icon="closeIcon" />
            </ion-button>
            
            <ion-title>{{ $t('teamFilter.title')}}</ion-title>
            <ion-buttons slot="end" class="ion-padding" @click="saveAndClose">
              <ion-text color="primary">{{ $t('teamFilter.button.save')}}</ion-text>
            </ion-buttons>
          </ion-toolbar>
      </ion-header>

      <ion-content>

        <ion-item lines="none" class="ion-margin-bottom ion-margin-top">
            <ion-toggle  @ionChange="showTeamName($event)"
            v-model="isShowName" color="primary"></ion-toggle>
            <ion-label>{{$t('teamFilter.showTeamName')}}</ion-label>
        </ion-item> 
        
        <!-- <ion-item>
            <ion-toggle  @ionChange="allCheck($event)" v-model="isAllSelected"
              value="all" color="primary"></ion-toggle>
            <ion-label>{{ $t('teamFilter.all')}}</ion-label>
        </ion-item> -->

      <ion-reorder-group reorder="true" @ionItemReorder="doReorder($event)" disabled="false" v-if="initalTeam.length!==0">

         <ion-item  v-for="(item,index) in initalTeam || []" :key="index">
            <ion-toggle v-if="item.name!=='All'" slot="start"  @ionChange="toggleHandler($event)"
            :value="item.name" color="primary" :checked="item.toggle" v-model="item.toggle"></ion-toggle>
            
            <ion-toggle v-if="item.name=='All'" slot="start"  @ionChange="allCheck($event)"
            :value="item.name" color="primary" :checked="item.toggle" v-model="item.toggle"></ion-toggle>

            <ion-avatar v-if="item.icon!==''" size="1.5rem">
                <img v-bind:src="item.icon" />
            </ion-avatar>

            <ion-icon v-if="item.name=='All'" :icon="globeIcon" class="global-icon" color="primary"/>
                       
            <ion-label class="ion-margin-start">{{item.name=='All' ? $t('teamFilter.all') : item.name }}</ion-label>
            <ion-reorder></ion-reorder>
            
        </ion-item>

      </ion-reorder-group>
</ion-content>
</ion-page>
</template>


<script lang="ts">
import {
 IonLabel, IonItem, IonToggle,modalController,
 IonHeader,IonIcon,IonAvatar,IonText,IonPage,
 IonButton,IonButtons,IonTitle,IonToolbar,
 IonContent,IonReorderGroup,IonReorder
} from '@ionic/vue';
import {
   closeOutline as closeIcon,globeOutline as globeIcon
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
      const flag = true;
     
      this.teamDetails.map((data: any)=>{
        const obj = {'name':data.name,'icon':data.avatar.url,'toggle':false,'priority':0,'isIcon':true}
        initalTeam.push(obj)
      });
      initalTeam.push({'name':'All','icon':'','toggle':false,'priority':this.teamDetails.length,'isIcon':true});
      
      tempArr= initalTeam;
    
      return{
          initalTeam,
          newTeamArray,
          isAllSelected,
          isShowName,
          tempArr,
          flag
      }
  },
 
  setup(){  
    const store = useStore();  
    return {  
      store,
      closeModal() {
        modalController.dismiss()
      },
      closeIcon,
      globeIcon
    }
    
  },
  mounted: function(){
    this.getSettings();
  },
  methods :{
    async getSettings(){
      const teamPriority: any =  this.store.state.auth.user;
      this.newTeamArray = [];
      const newArr: any[] = this.initalTeam;
      if(teamPriority.settings!==undefined && teamPriority.settings!==null){
        if(teamPriority.settings.feedTabs!==undefined && teamPriority.settings.feedTabs!==null){         
          teamPriority.settings.feedTabs[0].teams.map((data: any)=>this.newTeamArray.push(data));
        
          this.initalTeam = teamPriority.settings.feedTabs[0].teams;

          newArr.map((x: any)=>{
            const res = this.initalTeam.findIndex((y: any)=>{return y.name==x.name});
            if(res== -1){
              this.initalTeam.push(x)
            }
          })
            
          this.isShowName = teamPriority.settings.feedTabs[1].showName
          // this.initalTeam.sort((a: any,b: any) => a.priority-b.priority);

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
            if(this.flag){
            this.isAllSelected = false;
            this.initalTeam.filter(data=>data.toggle=false);
            this.flag = true;
            }
          }
        
      },
      toggleHandler(event: any){
          const value = event.detail.value;

          if(event.detail.checked){
            // this.flag = true;
              this.initalTeam.find((data: any)=>{if(data.name == value) {
                data.toggle = true;
              } })            
          }
          else{
              const index: number = this.initalTeam.findIndex((data: any)=>data.name==value);
              const allIndex: number = this.initalTeam.findIndex((data: any)=>data.name=='All')

              if(index>=0){
                this.initalTeam[index].toggle = false 
              }
              this.flag = false;
              this.isAllSelected = false;
              this.initalTeam[allIndex].toggle = false;
              // this.flag = true;
              
          }
      },
      doReorder(ev: CustomEvent<ItemReorderEventDetail>){ 
         
          this.initalTeam[ev.detail.from].priority = ev.detail.to+1,
          this.initalTeam[ev.detail.to].priority = ev.detail.from+1;
         
          this.initalTeam = ev.detail.complete(this.initalTeam);
      },
   
      saveAndClose() {
        const res: any= []
 
        if(this.isShowName){
          this.initalTeam.filter((item: any)=>item.isIcon=true)
          res.push({teams:this.initalTeam})
          res.push({showName:this.isShowName})
        }
        else{
          this.initalTeam.filter((item: any)=>item.isIcon=false)
          res.push({teams:this.initalTeam})
          res.push({showName:this.isShowName})      
        }
        
        this.store.dispatch('auth/setSetting', { 'feedTabs': res});
        modalController.dismiss(res);
    },
  },
  components: {
    IonLabel, IonItem, IonToggle,IonHeader,IonIcon,IonAvatar,
    IonButton,IonButtons,IonTitle,IonToolbar,
    IonContent,IonReorderGroup,IonReorder,IonText,IonPage
  }
});
</script>

<style scoped>
   
    ion-content{
        height: 100vh;
    }
    .globe-icon{
      font-size: 1.5rem;
    }

</style>