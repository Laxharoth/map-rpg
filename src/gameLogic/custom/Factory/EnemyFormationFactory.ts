import { MasterService } from "src/app/service/master.service"
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap"
import { EnemyFormation, EnemyFormationOptions } from "../Class/Character/NPC/EnemyFormations/EnemyFormation"

export const EnemyFormationFactory:FactoryFunction<EnemyFormation,EnemyFormationOptions> = (masterService,options)=>{
  const formation:EnemyFormation = new enemyFormationSwitcher[options.type](masterService)
  formation.fromJson(options)
  return formation;
}

type EnemyFormationConstructor = new(masterService:MasterService) =>EnemyFormation
export const enemyFormationSwitcher:{ [key: string]:EnemyFormationConstructor }  = {}
