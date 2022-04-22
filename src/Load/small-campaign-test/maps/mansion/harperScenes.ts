import { MasterService } from "src/app/service/master.service";
import { FactoryForModules } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Quest } from "src/gameLogic/custom/Class/Quest/Quest";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { QuestFactory } from "src/gameLogic/custom/Factory/QuestFactory";
import { FoolDragonSellerOutcome } from "../../quest";

export function harperGivesQuest(masterService:MasterService,Factory:FactoryForModules):Scene{
  const questFactory = Factory as typeof QuestFactory;
  masterService.QuestHolder.add(
    questFactory(masterService,{ Factory:"Quest",type:"FoolDragonSeller",status:"in progress" })
  )
  masterService.partyHandler.user.healHitPoints(Infinity);
  return {
    sceneData(){return "go get the egg, take a bag of diamonds to trade for it, place this tracker in the seller stuff without them noticing, DON'T FIGHT IT. "},
    options:[Factory.options.nextOption(masterService)],
  }
}
export function talkHarper(masterService:MasterService,Factory:FactoryForModules):Scene{
  const quest = masterService.QuestHolder.get("FoolDragonSeller");
  let text:string ="";
  switch(quest?.status){
    case "in progress":text="Go Get the egg dude.";break;
    case "complete":text="Thanks for the egg dude.";break;
    case "failed":text="Thanks for nothing dude.";break;
  }
  return {
    sceneData(){
      return text;
    },
    options:[Factory.options.nextOption(masterService)],
  }
}
export function harperFinishQuest(masterService:MasterService,Factory:FactoryForModules):Scene{
  return {
    sceneData(){
      const quest = masterService
        .QuestHolder.get("FoolDragonSeller") as unknown as Quest & { outcome:FoolDragonSellerOutcome };
      quest.complete();
      // tslint:disable-next-line: no-console
      console.log(quest);
      if(quest.outcome.deliveredEgg && quest.outcome.plantedTrack){
        return "Hey! you did it";
      }
      if(quest.outcome.plantedTrack && quest.outcome.inspectedEgg){
        return "hm, good enough";
      }
      return "...you had one job";
    },
    options:[Factory.options.nextOption(masterService)],
  }
}
