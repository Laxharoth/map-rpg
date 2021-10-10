import { Character } from "src/app/classes/Character/Character";
import { characterStats, damageTypes } from "src/app/customTypes/customTypes";
import { rangedname } from "src/app/customTypes/itemnames";
import { MasterService } from "src/app/service/master.service";
import { RangedWeapon } from "./RangedWeapon";

export class RangedTest extends RangedWeapon
{
  protected equipmentStats: characterStats = {};
  protected accuracy: number=70;
  get name(): rangedname { return 'Ranged Test'; }
  constructor(masterService:MasterService)
  { super(masterService,{},{piercedamage:20,energydamage:10}) }
  canEquip(character: Character): boolean { return true; }
}
