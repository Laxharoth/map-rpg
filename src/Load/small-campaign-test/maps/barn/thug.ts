import { BattleFactory } from './../../../../gameLogic/custom/Factory/BattleFactory';
import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { global_functions } from "src/gameLogic/core/Factory/Factory";
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { EnemyFormationFactory } from "src/gameLogic/custom/Factory/EnemyFormationFactory";

export function thugIntroScene(masterService:MasterService, Factory:FactoryFunction&global_functions):Scene{
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
        post_initialize_battle_options:(options)=>{
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
