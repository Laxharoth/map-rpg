import { PerkPoisonRush } from './../../Perk/PerkPoisonRush';
import { PerkGrappler } from './../../Perk/PerkGrappler';
import { PerkFright } from './../../Perk/PerkFright';
import { PerkCharm } from './../../Perk/PerkCharm';
import { perkname } from "src/app/customTypes/perkname";
import { MasterService } from "../../masterService";

export function PerkFactory(masterService:MasterService,perkname:perkname,options:{[key: string]: any}){
  const perk = new PerkSwitcher[perkname](masterService);
  perk.fromJson(options);
  return perk;
}

const PerkSwitcher = {
'Charmer':PerkCharm,
'Frighter':PerkFright,
'Grappler':PerkGrappler,
'Posion Rush':PerkPoisonRush,
}
