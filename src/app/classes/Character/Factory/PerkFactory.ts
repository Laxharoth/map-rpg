import { PerkPoisonRush } from './../../Perk/PerkPoisonRush';
import { PerkGrappler } from './../../Perk/PerkGrappler';
import { PerkFright } from './../../Perk/PerkFright';
import { PerkCharm } from './../../Perk/PerkCharm';
import { perkname, perknameEnum } from "src/app/customTypes/perkname";
import { MasterService } from "../../masterService";
import { PerkUpgradeable } from '../../Perk/PerkUpgradeable';

export function PerkFactory(masterService:MasterService,perkname:perkname,options:{[key: string]: any}){
  const perk = new PerkSwitcher[perkname](masterService);
  perk.fromJson(options);
  return perk;
}

const PerkSwitcher:{[key in perknameEnum]:any} = {
'Charmer':PerkCharm,
'Frighter':PerkFright,
'Grappler':PerkGrappler,
'Posion Rush':PerkPoisonRush,
'Perk Upgrade':PerkUpgradeable
}
