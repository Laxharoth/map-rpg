import { ActionOutput } from 'src/app/customTypes/customTypes';
import { shieldname } from 'src/app/customTypes/itemnames';
import { tag } from 'src/app/customTypes/tags';
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { StatusDefend } from '../../Character/Status/StatusTemporal/StatusDefend';
import { Equipment } from "../Equipment";

/**
 * Type of equipment, adds defend method.
 *
 * @export
 * @abstract
 * @class Shield
 * @extends {Equipment}
 */
export abstract class Shield extends Equipment{
  /**
   * Can only use shieldname
   *
   * @readonly
   * @abstract
   * @type {shieldname}
   * @memberof Shield
   */
  abstract get name(): shieldname;
  /**
   * Equips into user shield
   *
   * @param {Character} user The character that uses the shield.
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof Shield
   */
  itemEffect(user:Character,target: Character): ActionOutput
  {
    const output = super.itemEffect(user, user);
    user.unequipShield();
    user.shield = this;
    return output;
  }
  /**
   * Adds the StatusDefend to the character with the shield.
   *
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof Shield
   */
  defend(target : Character):ActionOutput
  {
    const statusOutput = target.addStatus(new StatusDefend(this.masterService));
    const reactionOutput = target.react(this.tags,target);
    return pushBattleActionOutput(statusOutput,reactionOutput);
  }
  get tags(): tag[] { return ['shield']}
}
