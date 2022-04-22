import { MasterService } from "src/app/service/master.service";
import { Storeable } from "src/gameLogic/core/Factory/Factory";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Hashable } from "src/gameLogic/custom/ClassHelper/ObjectSet";
import { tag as tagnames } from "src/gameLogic/custom/customTypes/tags";
import { BattleCommand } from "../../Battle/BattleCommand";

/** A Reaction for characters to do something after an action affects them. */
export abstract class Reaction implements Hashable, Storeable{
  /** The list of tags the reaction should be triggered with. */
  protected abstract whatTriggers: tagnames[][];
  /** The list of tags the reaction should be never trigger. */
  protected preventReaction:tagnames[][] = [['paralized'],['before-action']];
  abstract readonly type:string;
  /** TODO doc */
  protected abstract name:string;
  /** What the reaction does when it is triggered */
  protected abstract action(reactCharacter: Character,action:BattleCommand):ActionOutput;
  protected masterService!:MasterService;

  constructor(masterService:MasterService){
    this.masterService = masterService;
  }

  /**
   * Checks the tags of the action to see if should trigger the reaction.
   * Then applies the reaction.
   */
  reaction(reactCharacter:Character,action:BattleCommand): ActionOutput{
    const { tags:actionTags } = action;
    // reaction is prevented
    if(this.preventReaction.some(preventPattern => preventPattern.every(tag=>actionTags.includes(tag))))return [[],[]]
    for( const trigger of this.whatTriggers ){
          if(trigger.every(tag=>actionTags.includes(tag))){
            // reaction is triggered
            return this.action(reactCharacter,action)
          }
      }
      // reaction is not triggered
      return [[],[]]
  }
  // @ts-ignore
  hash(): string { return this.constructor }
  fromJson(options: ReactionOptions): void { return undefined; }
  toJson():ReactionOptions{
    return {
      Factory:"Reaction",
      type:this.type
    };
  }
}
// tslint:disable-next-line: max-classes-per-file
export abstract class BeforeActionReaction extends Reaction{
  protected preventReaction: tagnames[][]= [['paralized']]
}
export type ReactionOptions={
  Factory:"Reaction";
  type:string;
  [key: string]:any;
}
