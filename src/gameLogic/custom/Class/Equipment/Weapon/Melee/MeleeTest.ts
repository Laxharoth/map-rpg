import { damageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { MeleeWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon';
import { meleename } from 'src/gameLogic/custom/Class/Items/Item.type';

export class MeleeTest extends MeleeWeapon
{
  protected _stats_modifier:CalculatedStats = {physical_attack:20}
  protected _damageTypes:damageTypes = {bluntdamage:30};
  get name(): meleename { return 'Melee test'; }
  canEquip(character: Character): boolean { return true; }
}
