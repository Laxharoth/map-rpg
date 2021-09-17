import { Character } from "src/app/classes/Character/Character";
import { damageTypes } from "src/app/customTypes/customTypes";
import { rangedname } from "src/app/customTypes/itemnames";
import { RangedWeapon } from "./RangedWeapon";

export class RangedTest extends RangedWeapon
{
  protected accuracy: number=70;
  get name(): rangedname { return 'Ranged Test'; }
  canEquip(character: Character): boolean { return true; }
  protected damageTypes: damageTypes = {piercedamage:20,energydamage:10};
}
