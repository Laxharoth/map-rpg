import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { SpecialAttack } from 'src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

/**
 * Altered status to affect characters.
 *
 * @export
 * @abstract
 * @class Status
 * @implements {storeable}
 * @constructor Initializes the masterService
 */
export abstract class Status implements storeable
{
  protected masterService:MasterService;
  protected _stats_modifier:CalculatedStats = {};
  protected _resistance_stats:ResistanceStats = {};
  constructor(masterService:MasterService){this.masterService=masterService;}
  /**
   * The name of the status.
   *
   * @readonly
   * @abstract
   * @type {statusname}
   * @memberof Status
   */
  abstract get name(): statusname;
  /**
   * A string that explains the status.
   *
   * @readonly
   * @abstract
   * @type {string}
   * @memberof Status
   */
  abstract get description(): string;
  /**
   * The effect of the status on the characters.
   *
   * @protected
   * @abstract
   * @param {Character} target The character the status should be applied to.
   * @return {*}  {ActionOutput}
   * @memberof Status
   */
  protected effect(target: Character):ActionOutput { return [[],[]] }
  /**
   * Apply the effect on the character.
   * Also check if the character can react to the effect of the status.
   *
   * @param {Character} target The character the status should be applied to.
   * @return {*}  {ActionOutput}
   * @memberof Status
   */
  applyEffect(target: Character):ActionOutput{
    const effect = this.effect(target);
    return pushBattleActionOutput(target.react(this.tags,target), effect);
  }
  applyModifiers(character:Character):void
  {
    for(const [key,value] of Object.entries(this._stats_modifier))
    { character.calculated_stats[key] += value}
    for(const [key,value] of Object.entries(this._resistance_stats))
    { character.calculated_resistance[key] += value}
  }
  /**
   * Check if the status can be added to the character.
   *
   * @param {Character} target The character to attach the status to.
   * @return {*}  {boolean}
   * @memberof Status
   */
  canApply(target: Character):boolean{return target.hasStatus(this.name)===0;}
  /**
   * Defines what to do when the status is added to the character.
   *
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof Status
   */
  onStatusGainded(target: Character):ActionOutput{
    this.applyModifiers(target);
    return target.react(this.tags.concat(['status gained']),target)
  };
  /**
   * Defines what to do when the status is removed from the character.
   *
   * @param {Character} target
   * @return {*}  {ActionOutput}
   * @memberof Status
   */
  onStatusRemoved(target: Character)  :ActionOutput{ return target.react(this.tags.concat(['status ended']),target) };
  /**
   * Tags associated with the status.
   *
   * @readonly
   * @type {tag[]}
   * @memberof Status
   */
  get tags(): tag[]{ return []}
  /**
   * Reactions that the status grants.
   *
   * @readonly
   * @type {Reaction[]}
   * @memberof Status
   */
  get reactions(): Reaction[]{ return [];}
  /**
   * SpecialAttacks that the status grants.
   *
   * @readonly
   * @type {SpecialAttack[]}
   * @memberof Status
   */
  get specials():SpecialAttack[]{ return [];}

  toJson():StatusStoreable{return { Factory:"Status",type:this.name}};
  fromJson(options:StatusStoreable):void{};
}
export type StatusStoreable = {Factory:"Status",type:statusname,[key:string]:any;}
