import { QuestOptions } from 'src/gameLogic/custom/Class/Quest/Quest';
import { Subscription } from "rxjs";
import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { questnames } from "src/gameLogic/custom/Class/Quest/Quest.type";
import { GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';

const register:registerFunction = ({quest}, {quest:{Quest}}, Factory)=>{
  class FoolDragonSeller extends Quest{
    type: questnames = "FoolDragonSeller";
    name: string = "Fool the Dragon Seller";
    description_text: string = "get the egg";
    masterService:MasterService;
    plantedTrack:boolean = false;
    inspectedEgg:boolean = false;
    outcome:FoolDragonSellerOutcome|null=null;
    subscription:Subscription;
    constructor(masterService:MasterService){
      super();
      this.masterService = masterService;
      this.subscription=masterService.flagsHandler.onFlagChanged().subscribe( (flag)=>{
        if(flag === "FoolDragonSeller-plantedTrack"){
          this.plantedTrack = masterService.flagsHandler.getFlag("FoolDragonSeller-plantedTrack");
        }
        if(flag === "FoolDragonSeller-inspectedEgg"){
          this.inspectedEgg = masterService.flagsHandler.getFlag("FoolDragonSeller-inspectedEgg");
        }
        if(this.plantedTrack && this.inspectedEgg){
          this.subscription.unsubscribe();
        }
      });
    }
    toJson(): FoolDragonSellerOptions {
      return {
        Factory:"Quest",
        type:"FoolDragonSeller",
        status:this.status,
        plantedTrack:this.plantedTrack,
        inspectedEgg:this.inspectedEgg,
        outcome:this.outcome,
      };
    }
    fromJson(options: FoolDragonSellerOptions): void {
      this.plantedTrack = options.plantedTrack;
      this.inspectedEgg = options.inspectedEgg;
      this.outcome = options.outcome;
      if(this.plantedTrack&&this.inspectedEgg)
      {   this.subscription.unsubscribe();  }
    }
    get hasEgg():boolean{
      return this.masterService.partyHandler.user.inventory.items.some(item => item.type === "FakeDragonEgg");
    }
    complete(): void {
      if(this.outcome){ return; }
      if(this.plantedTrack && (this.hasEgg || this.inspectedEgg))this.status = "complete";
      else this.status = "failed";
      this.outcome = {
        deliveredEgg: this.hasEgg,
        inspectedEgg: this.inspectedEgg,
        plantedTrack: this.plantedTrack
      }
      const egg = this.masterService.partyHandler.user.inventory.items.find(item => item.type === "FakeDragonEgg");
      if(egg){ this.masterService.partyHandler.user.inventory.dropItem(egg,1); }
    }
    get add_description(): GameElementDescriptionSection[] {
      if(this.outcome)
        return [
          {type:"label",name:"condition",section_items:[
            {name:'delivered egg',value:this.outcome.deliveredEgg},
            {name:'inspected the egg',value:this.outcome.inspectedEgg},
            {name:'planted device',value:this.outcome.plantedTrack},
          ]}
        ]
      return [
        {type:"label",name:"condition",section_items:[
          {name:'has the egg',value:this.hasEgg},
          {name:'inspected the egg',value:this.inspectedEgg},
          {name:'planted device',value:this.plantedTrack},
        ]}
      ];

    }
  }
  quest["FoolDragonSeller"] = FoolDragonSeller;
}

export interface FoolDragonSellerOptions extends QuestOptions{
  type:"FoolDragonSeller",
  plantedTrack:boolean,
  inspectedEgg:boolean,
  outcome:FoolDragonSellerOutcome|null,
};
export interface FoolDragonSellerOutcome{
  deliveredEgg:boolean;
  inspectedEgg:boolean;
  plantedTrack:boolean;
}
const module_name = "small-campaign-quest";
const module_dependency:string[] = [];
export { register, module_name, module_dependency };
