import { ActionOutput } from "src/app/customTypes/customTypes";
import { armorname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";

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
