import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Weapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Weapon";
import { rangedname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/** A type of weapon thar normally uses aim to determinate damage. */
export abstract class RangedWeapon extends Weapon{
  damagestat(user   : Character):number{return user.calculatedStats.rangedAttack;}
  defencestat(target: Character):number{return target.calculatedStats.rangedDefence;}
  readonly abstract type:rangedname;
  abstract get name():string;
  get tags(): tag[] { return ['ranged weapon']; }
  /** Equips into the character ranged weapon */
  protected _itemEffect(user:Character,target: Character): ActionOutput{
    user.unequipRanged();
    user.characterEquipment.rangedWeapon = this;
    return super._itemEffect(user, target);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class RangedUnharmed extends RangedWeapon{
  maxStack = 0;
  readonly type:"RangedUnharmed"="RangedUnharmed"
  get name(): string { return 'a rock'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['unequiped','ranged unharmed']; }
  calculateDamage(user:Character,target:Character):number { return 10; }
  get isSingleTarget(): boolean { return true; }
}
