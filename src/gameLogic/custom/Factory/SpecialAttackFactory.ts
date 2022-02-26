import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { specialsname } from "../Class/Items/Item.type";
import { SpecialAttack, SpecialAttackOptions } from "../Class/Items/SpecialAttack/SpecialAttack";

/** Creates a special attack */
export const SpecialAttackFactory=(masterService:MasterService,options:SpecialAttackOptions)=>
{
  const special_attack = new special_attack_switcher[options.type](masterService) as SpecialAttack;
  special_attack.fromJson(options)
  return special_attack
}
//@ts-ignore
export const special_attack_switcher:{[key in specialsname]:SpecialAttackConstructor} = {}
export type SpecialAttackFactoryFunction = FactoryFunction<SpecialAttack>;
export interface SpecialAttackConstructor {new (MasterService:MasterService):SpecialAttack};
