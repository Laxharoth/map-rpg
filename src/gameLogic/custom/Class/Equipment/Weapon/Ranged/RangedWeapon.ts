import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
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
  protected damagestat(user   : Character):number{return user.stats.aim;}
  protected defencestat(target: Character):number{return target.stats.defence;}
  abstract get name():rangedname;
  attack(user:Character,target:Character):ActionOutput
  {
    const [descriptions,strings]=user.addStatus(new StatusRangedAttack(this.masterService));
    const [attackdescription,attackstring] =super.attack(user,target);
    descriptions.push(...attackdescription);
    strings.push(...attackstring);
    return [descriptions,strings];
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
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    user.unequipRanged();
    user.rangedWeapon = this;
    return output;
  }
}

export class RangedUnharmed extends RangedWeapon
{
  maxStack = 0;
  protected accuracy = 50;
  get name(): rangedname { return 'a rock'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['ranged unharmed']; }
  calculateDamage(user:Character,target:Character):number { return 10; }
  get isSingleTarget(): boolean { return true; }
}
