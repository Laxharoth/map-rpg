import { MasterService } from "src/app/service/master.service";
import { Perk, PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perknameEnum } from "src/gameLogic/custom/Class/Perk/Perk.type";

/**
 * Creates an Perk with the given perkname
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {perkname} perkname The perkname
 * @param {{[key: string]: any}} options The options from the perk created with the storeable.toJson
 * @return {Perk} An Perk with the loaded options
 */
export function PerkFactory(masterService:MasterService,options:PerkStoreable):Perk {
  const perk = new perk_switcher[options.type](masterService);
  perk.fromJson(options);
  return perk;
}
//@ts-ignore
export const perk_switcher:{[key in perknameEnum]:PerkConstructor} = {}
export interface PerkConstructor{ new (masterService:MasterService):Perk }
