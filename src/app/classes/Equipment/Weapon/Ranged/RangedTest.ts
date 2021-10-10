import { Character } from "src/app/classes/Character/Character";
import { characterStats, damageTypes } from "src/app/customTypes/customTypes";
import { rangedname } from "src/app/customTypes/itemnames";
import { MasterService } from "src/app/service/master.service";
import { RangedWeapon } from "./RangedWeapon";

export class RangedTest extends RangedWeapon
{
  protected _damageTypes:damageTypes = {piercedamage:20,energydamage:10}
  protected accuracy: number=70;
  get name(): rangedname { return 'Ranged Test'; }
  canEquip(character: Character): boolean { return true; }
}
