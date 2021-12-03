import { Character, characterStats } from 'src/gameLogic/custom/Class/Character/Character';
import { MeleeWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon';
import { damageTypes } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { meleename } from 'src/gameLogic/custom/Class/Items/Item.type';

export class MeleeTest extends MeleeWeapon
{
  protected accuracy: number = 100;
  protected equipmentStats: characterStats = {attack:20};
  protected _damageTypes:damageTypes = {bluntdamage:30};
  get name(): meleename { return 'Melee test'; }
  canEquip(character: Character): boolean { return true; }
}
