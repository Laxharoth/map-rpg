import { DamageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Weapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import { meleename } from 'src/gameLogic/custom/Class/Items/Item.type';
import { OnePunch } from 'src/gameLogic/custom/Class/Items/SpecialAttack/OnePunch';
import { SpecialAttack } from 'src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack';
import { tag } from 'src/gameLogic/custom/customTypes/tags';

/** A type of weapon that normally uses attack stat to determine damage. */
export abstract class MeleeWeapon extends Weapon
{
  damagestat(user   : Character):number{return user.calculated_stats.physical_attack;}
  defencestat(target: Character):number{return target.calculated_stats.physical_defence;}
  readonly abstract type:meleename
  abstract get name():string;
  /** Equips into the character melee weapon */
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
  protected _damageTypes:DamageTypes = {bluntdamage:100};
  readonly type:"MeleeUnharmed"="MeleeUnharmed";
  get name(): string { return 'hand'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['unequiped','melee unharmed']; }
  get isSingleTarget(): boolean { return true;}
  get specials():SpecialAttack[]{return [this.onePunch]}
}
