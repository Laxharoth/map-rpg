import { Character } from "src/app/classes/Character/Character";
import { MasterService } from "src/app/classes/masterService";
import { damageTypes } from "src/app/customTypes/customTypes";
import { rangedname } from "src/app/customTypes/equipmentnames";
import { tag } from "src/app/customTypes/tags";
import { RangedWeapon } from "./RangedWeapon";

export class RangedUnharmed extends RangedWeapon
{
  protected statsModifier = {};
  maxStack = 0;
  protected damageTypes: damageTypes;
  protected accuracy = 50;
  constructor(masterService:MasterService)
  { super(masterService,{}) }
  get name(): rangedname { return 'a rock'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['ranged unharmed']; }
  calculateDamage(user:Character,target:Character):number { return 10; }
  get isSingleTarget(): boolean { return true; }
}
