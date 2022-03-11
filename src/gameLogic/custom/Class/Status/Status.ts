import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { SpecialAttack } from 'src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack';
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { hashable } from "../../ClassHelper/ObjectSet";

/** Altered status that affect characters. */
export abstract class Status implements storeable,hashable
{
  abstract type:statustype;
  protected masterService:MasterService;
  protected _stats_modifier:CalculatedStats = {};
  protected _resistance_stats:ResistanceStats = {};
  constructor(masterService:MasterService){this.masterService=masterService;}
  /** The name of the status. */
  abstract get name(): string;
  /** A string that explains the status. */
  abstract get description(): string;
  /** The effect of the status on the characters. */
  protected effect(target: Character):ActionOutput { return [[],[]] }
  /**
   * Apply the effect on the character.
   * Also check if the character can react to the effect of the status.
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
  /** Check if the status can be added to the character. */
  canApply(target: Character):boolean{return true;}
  /** Defines what to do when the status is added to the character. */
  onStatusGainded(target: Character):ActionOutput{
    this.applyModifiers(target);
    return target.react(this.tags.concat(['status gained']),target)
  };
  /** Defines what to do when the status is removed from the character. */
  onStatusRemoved(target: Character)  :ActionOutput{ return target.react(this.tags.concat(['status ended']),target) };
  /** Tags associated with the status. */
  get tags(): tag[]{ return []}
  /** Reactions that the status grants. */
  get reactions(): Reaction[]{ return [];}
  /** SpecialAttacks that the status grants. */
  get specials():SpecialAttack[]{ return [];}

  toJson():StatusStoreable{return { Factory:"Status",type:this.type}};
  fromJson(options:StatusStoreable):void{};
  hash(): string {return this.name}
}
export type StatusStoreable = {Factory:"Status",type:statustype,[key:string]:any;}
