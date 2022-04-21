import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { specialsname } from "../Class/Items/Item.type";
import { SpecialAttack, SpecialAttackOptions } from "../Class/Items/SpecialAttack/SpecialAttack";

/** Creates a special attack */
export const SpecialAttackFactory=(masterService:MasterService,options:SpecialAttackOptions)=>{
  const specialAttack = new specialAttackSwitcher[options.type](masterService) as SpecialAttack;
  specialAttack.fromJson(options)
  return specialAttack
}
//@ts-ignore
export const specialAttackSwitcher:{[key in specialsname]:SpecialAttackConstructor} = {}
export type SpecialAttackFactoryFunction = FactoryFunction<SpecialAttack>;
export interface SpecialAttackConstructor {new (MasterService:MasterService):SpecialAttack};
