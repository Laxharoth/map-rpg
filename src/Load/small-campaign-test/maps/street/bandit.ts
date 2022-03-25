import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { global_functions } from "src/gameLogic/core/Factory/Factory";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { BattleFactory } from "src/gameLogic/custom/Factory/BattleFactory";
import { EnemyFormationFactory } from "src/gameLogic/custom/Factory/EnemyFormationFactory";

export function banditsWantRealEgg(masterService:MasterService, Factory:FactoryFunction&global_functions):Scene{
  return {
    sceneData(){
      return "Bandit: Nice trick with the fake egg. Hand over the real one!!";
    },
    options:[Factory.options.nextOption(masterService,"Next",()=>{
      masterService.sceneHandler.nextScene(false);
      battleBandits();
    })]
  }
  function battleBandits(){
    const bandits = (Factory as typeof EnemyFormationFactory)(masterService,{ Factory:"EnemyFormation", type:"Bandits"});
    (Factory as typeof BattleFactory)(masterService,{ Factory:"Battle", type:"",enemy:bandits }).start();
  }
}
