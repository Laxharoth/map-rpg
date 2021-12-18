import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { damageTypes } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { rangedname } from "src/gameLogic/custom/Class/Items/Item.type";

export class RangedTest extends RangedWeapon
{
  protected _damageTypes:damageTypes = {piercedamage:20,energydamage:10}
  get name(): rangedname { return 'Ranged Test'; }
  canEquip(character: Character): boolean { return true; }
}
