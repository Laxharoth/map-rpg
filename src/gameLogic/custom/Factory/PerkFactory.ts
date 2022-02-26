import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { MasterService } from "src/app/service/master.service";
import { Perk, PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perknameEnum } from "src/gameLogic/custom/Class/Perk/Perk.type";

/** Creates an Perk with */
export const PerkFactory:FactoryFunction<Perk, PerkStoreable> = (masterService,options)=>{
  const perk = new perk_switcher[options.type](masterService);
  perk.fromJson(options);
  return perk;
}
//@ts-ignore
export const perk_switcher:{[key in perknameEnum]:PerkConstructor} = {}
export interface PerkConstructor{ new (masterService:MasterService):Perk }
