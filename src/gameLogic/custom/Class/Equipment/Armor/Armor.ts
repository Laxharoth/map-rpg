import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { armorname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * A type of equipment. with no aditional properties.
 *
 * @export
 * @abstract
 * @class Armor
 * @extends {Equipment}
 */
export abstract class Armor extends Equipment
{
  /**
   * Can only use armorname
   *
   * @readonly
   * @abstract
   * @type {armorname}
   * @memberof Armor
   */
  abstract get name():armorname;
  /**
   * Equips into character armor.
   *
   * @param {Character} user
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof Armor
   */
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    user.unequipArmor();
    user.armor = this;
    return output;
  }
  get tags(): tag[] { return ['armor']; }
}

export class ArmorNoArmor extends Armor
{
  get name(): armorname { return 'No Armor'; }
  canEquip(character: Character): boolean { return false; }
  get tags(): tag[] { return ['no armor']; }
  get isSingleTarget(): boolean { return true; }
}
