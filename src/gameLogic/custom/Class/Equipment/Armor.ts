import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { armorname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/** A type of equipment. with no aditional properties. */
export abstract class Armor extends Equipment{
  readonly abstract type:armorname
  abstract get name():string;
  /** Equips into character armor. */
  protected _itemEffect(user:Character,target: Character): ActionOutput{
    user.unequipArmor();
    user.characterEquipment.armor = this;
    return super._itemEffect(user, target);
  }
  get tags(): tag[] { return ['armor']; }
}

// tslint:disable-next-line: max-classes-per-file
export class ArmorNoArmor extends Armor{
  readonly type:"ArmorNoArmor"="ArmorNoArmor"
  get name(): string { return 'No Armor'; }
  canEquip(character: Character): boolean { return false; }
  get tags(): tag[] { return ['unequiped','no armor']; }
  get isSingleTarget(): boolean { return true; }
}
