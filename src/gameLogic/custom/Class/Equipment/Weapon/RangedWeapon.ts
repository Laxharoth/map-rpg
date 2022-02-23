import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Weapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Weapon";
import { rangedname } from "src/gameLogic/custom/Class/Items/Item.type";
import { StatusRangedAttack } from "src/gameLogic/custom/Class/Status/StatusTemporal/StatusRangedAttack";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";

/**
 * A type of weapon thar normally uses aim to determinate damage.
 *
 * @export
 * @abstract
 * @class RangedWeapon
 * @extends {Weapon}
 */
export abstract class RangedWeapon extends Weapon
{
  damagestat(user   : Character):number{return user.calculated_stats.ranged_attack;}
  defencestat(target: Character):number{return target.calculated_stats.ranged_defence;}
  readonly abstract type:rangedname;
  abstract get name():string;
  attack(user:Character,target:Character):ActionOutput
  {
    const [scenes,strings]=user.addStatus(new StatusRangedAttack(this.masterService));
    const [attack_scene,attackstring] =super.attack(user,target);
    scenes.push(...attack_scene);
    strings.push(...attackstring);
    return [scenes,strings];
  }
  get tags(): tag[] { return ['ranged weapon']; }

  protected accuracyTest(user:Character,target:Character)
  {
    let accuracyFix = 0;
    if(user.hasTag('restrained')) accuracyFix-=20;
    return super.accuracyTest(user,target)+randomBetween(0,accuracyFix);
  }
  /**
   * Equips into the character ranged weapon
   *
   * @param {Character} user
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof RangedWeapon
   */
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
    user.unequipRanged();
    user.character_equipment.rangedWeapon = this;
    return super._itemEffect(user, target);
  }
}

export class RangedUnharmed extends RangedWeapon
{
  maxStack = 0;
  readonly type:"RangedUnharmed"="RangedUnharmed"
  get name(): string { return 'a rock'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['unequiped','ranged unharmed']; }
  calculateDamage(user:Character,target:Character):number { return 10; }
  get isSingleTarget(): boolean { return true; }
}
