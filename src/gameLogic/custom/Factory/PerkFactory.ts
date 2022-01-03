import { MasterService } from "src/app/service/master.service";
import { Perk, PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname, perknameEnum } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { PerkCharm } from "src/gameLogic/custom/Class/Perk/PerkCharm";
import { PerkFright } from "src/gameLogic/custom/Class/Perk/PerkFright";
import { PerkGrappler } from "src/gameLogic/custom/Class/Perk/PerkGrappler";
import { PerkPoisonRush } from "src/gameLogic/custom/Class/Perk/PerkPoisonRush";
import { PerkUpgradeable } from "src/gameLogic/custom/Class/Perk/PerkUpgradeable";

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
  const perk = new PerkSwitcher[options.type](masterService);
  perk.fromJson(options);
  return perk;
}

/** @type {[key: string]:Perk.constructor} */
const PerkSwitcher:{[key in perknameEnum]:any} = {
'Charmer':PerkCharm,
'Frighter':PerkFright,
'Grappler':PerkGrappler,
'Posion Rush':PerkPoisonRush,
'Perk Upgrade':PerkUpgradeable
}
