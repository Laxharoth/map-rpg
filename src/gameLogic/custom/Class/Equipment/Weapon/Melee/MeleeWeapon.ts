import { ActionOutput, Character, characterStats } from 'src/gameLogic/custom/Class/Character/Character';
import { damageTypes, Weapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
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
  protected damagestat(user   : Character):number{return user.stats.attack;}
  protected defencestat(target: Character):number{return target.stats.defence;}
  abstract get name():meleename;
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
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    user.unequipMelee();
    user.meleeWeapon = this;
    return output;
  }
  get tags(): tag[] { return ['melee weapon']; }
}

export class MeleeUnharmed extends MeleeWeapon
{
  readonly onePunch = new OnePunch(this.masterService);
  maxStack = 0;
  protected accuracy: number = 100;
  protected equipmentStats: characterStats = {evasion:30};
  protected _damageTypes:damageTypes = {bluntdamage:10};
  get name(): meleename { return 'hand'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['melee unharmed']; }
  get isSingleTarget(): boolean { return true;}
  get specials():SpecialAttack[]{return [this.onePunch]}
}