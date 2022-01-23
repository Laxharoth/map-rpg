import { damageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Weapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { meleename } from 'src/gameLogic/custom/Class/Items/Item.type';
import { OnePunch } from 'src/gameLogic/custom/Class/Items/SpecialAttack/OnePunch';
import { SpecialAttack } from 'src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack';
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { randomBetween } from 'src/gameLogic/custom/functions/htmlHelper.functions';

/**
 * A type of weapon that normally uses attack stat to determine damage.
 *
 * @export
 * @abstract
 * @class MeleeWeapon
 * @extends {Weapon}
 */
export abstract class MeleeWeapon extends Weapon
{
  damagestat(user   : Character):number{return user.calculated_stats.physical_attack;}
  defencestat(target: Character):number{return target.calculated_stats.physical_defence;}
  readonly abstract type:meleename
  abstract get name():string;
  protected accuracyTest(user:Character,target:Character)
  {
    let accuracyFix = 0;
    if(target.hasTag('prone')) accuracyFix+=20;
    return super.accuracyTest(user,target)+randomBetween(0,accuracyFix);
  }
  /**
   * Equips into the character melee weapon
   *
   * @param {Character} user
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof MeleeWeapon
   */
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
    user.unequipMelee();
    user.character_equipment.meleeWeapon = this;
    return super._itemEffect(user, target);
  }
  get tags(): tag[] { return ['melee weapon']; }
}

export class MeleeUnharmed extends MeleeWeapon
{
  readonly onePunch = new OnePunch(this.masterService);
  maxStack = 0;
  protected _stats_modifier: CalculatedStats = {accuracy:30};
  protected _damageTypes:damageTypes = {bluntdamage:10};
  readonly type:"MeleeUnharmed"="MeleeUnharmed";
  get name(): string { return 'hand'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['unequiped','melee unharmed']; }
  get isSingleTarget(): boolean { return true;}
  get specials():SpecialAttack[]{return [this.onePunch]}
}
