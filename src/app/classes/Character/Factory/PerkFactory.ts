import { PerkPoisonRush } from './../../Perk/PerkPoisonRush';
import { PerkGrappler } from './../../Perk/PerkGrappler';
import { PerkFright } from './../../Perk/PerkFright';
import { PerkCharm } from './../../Perk/PerkCharm';
import { perkname, perknameEnum } from "src/app/customTypes/perkname";
import { MasterService } from "../../masterService";
import { PerkUpgradeable } from '../../Perk/PerkUpgradeable';
import { Perk } from '../../Perk/Perk';

/**
 * Creates an Perk with the given perkname
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {perkname} perkname The perkname
 * @param {{[key: string]: any}} options The options from the perk created with the storeable.toJson
 * @return {Perk} An Perk with the loaded options
 */
export function PerkFactory(masterService:MasterService,perkname:perkname,options:{[key: string]: any}):Perk {
  const perk = new PerkSwitcher[perkname](masterService);
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
