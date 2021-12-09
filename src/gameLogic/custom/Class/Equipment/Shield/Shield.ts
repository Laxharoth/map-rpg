import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { shieldname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { StatusDefend } from "src/gameLogic/custom/Class/Status/StatusTemporal/StatusDefend";
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

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
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
    user.unequipShield();
    user.shield = this;
    return super._itemEffect(user, target);
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

export class ShieldNoShield extends Shield
{
  get name(): shieldname { return 'No shield'; }
  canEquip(character: Character): boolean { return false; }
  get tags(): tag[] { return ['no shield']; }
  get isSingleTarget(): boolean { return true; }
}
