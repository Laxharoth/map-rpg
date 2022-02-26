import { MasterService } from "src/app/service/master.service"
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap"
import { EnemyFormation, EnemyFormationOptions } from "../Class/Character/NPC/EnemyFormations/EnemyFormation"

export const EnemyFormationFactory:FactoryFunction<EnemyFormation,EnemyFormationOptions> = (masterService,options)=>{
  return new enemy_formation_switcher[options.type](masterService,options)
}

interface EnemyFormationConstructor{
  new:(masterService:MasterService)=>EnemyFormation
}
/** @type { [key: string]:EnemyFormationConstructor } */
export const enemy_formation_switcher = {

}
