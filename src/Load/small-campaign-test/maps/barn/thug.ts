import { MasterService } from "src/app/service/master.service";
import { FactoryForModules } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { BattleFactory } from "src/gameLogic/custom/Factory/BattleFactory";
import { EnemyFormationFactory } from "src/gameLogic/custom/Factory/EnemyFormationFactory";

export function thugIntroScene(masterService:MasterService, Factory:FactoryForModules):Scene{
  const thug = (Factory as typeof EnemyFormationFactory)(masterService,{ Factory:"EnemyFormation", type:"ThugCrew"});
  const options:SceneOptions[] = [
    //@ts-ignore
    thug.preventBattleByGiveUpEgg(),//Give Egg
    {
      text:"Fight",
      action: () =>{
        masterService.sceneHandler.nextScene(false);
        (Factory as typeof BattleFactory)(masterService, {
        Factory: "Battle",
        type: "Battle",
        enemy: thug,
        postInitializeBattleOptions:(options)=>{
          //@ts-ignore
          options[12] = thug.escapeByGiveUpEgg();
        }
        }).start(); //Fight
      }
    }
  ]
  return {
    sceneData(){ return "appears a thug that wants the egg"; },
    options
  }

}
