import { ActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../Character";
import { Status } from "./Status";

/**
 * Specific Status that occur only in battle.
 *
 * @export
 * @abstract
 * @class StatusBattle
 * @extends {Status} Adds number of turns as duration of status in battle.
 */
export abstract class StatusBattle extends Status
{
  /**
   * The number of turns this status last.
   *
   * @protected
   * @abstract
   * @type {number}
   * @memberof StatusBattle
   */
  protected abstract DURATION: number;
  /**
   * Applies the effect to the status, and reduces the duration.
   * If the duration reach zero, removes itself from the character.
   *
   * @param {Character} target The character the status should be applied to.
   * @return {*}  {ActionOutput}
   * @memberof StatusBattle
   */
  applyEffect(target: Character):ActionOutput
  {
    this.DURATION--;
    if(this.DURATION<=0)return target.removeStatus(this);
    return super.applyEffect(target);
  }
  /**
   * Increases the duration of the status
   *
   * @memberof StatusBattle
   */
  set extraDuration(extra:number){this.DURATION+=extra;}
  /**
   * StatusBattle cant be saved or loaded.
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof StatusBattle
   */
  toJson():{[key: string]:any}{console.error("StatusBattle cant be saved or loaded.");return {}};
  /**
   * StatusBattle cant be saved or loaded.
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof StatusBattle
   */
  fromJson(options:{[key: string]: any}):void{console.error("StatusBattle cant be saved or loaded.");};
}

/**
 * Status that check if the character affected by the status can attack the target.
 *
 * @export
 * @interface StatusPreventAttack
 */
export interface StatusPreventAttack
{
  /**
   * A discriminator to check if a class implements the interface.
   *
   * @type {'StatusPreventAttack'}
   * @memberof StatusPreventAttack
   */
  discriminator:'StatusPreventAttack';
  /**
   * Determinate if the character affected by the status can attack the target.
   *
   * @param {Character} target The target of the attack.
   * @return {*}  {boolean}
   * @memberof StatusPreventAttack
   */
  canAttack(target:Character):boolean;
  /**
   * Gets a description if the character can not attack the target.
   *
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof StatusPreventAttack
   */
  preventAttackDescription(target:Character):ActionOutput;
}

/**
 * Checks if a status implements StatusPreventAttack.
 *
 * @export
 * @param {*} object The status object.
 * @return {*}
 */
export function isStatusPreventAttack(object:any):boolean { return object.discriminator === 'StatusPreventAttack'; }
