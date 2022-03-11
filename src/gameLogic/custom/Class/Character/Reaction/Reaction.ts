import { MasterService } from "src/app/service/master.service";
import { storeable, StoreableType } from "src/gameLogic/core/Factory/Factory";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { hashable } from "src/gameLogic/custom/ClassHelper/ObjectSet";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/** A Reaction for characters to do something after an action affects them. */
export abstract class Reaction implements hashable, storeable{
  /** The list of tags the reaction should be triggered with. */
  protected abstract whatTriggers: tag[][];
  /** The list of tags the reaction should be never trigger. */
  protected prevent_reaction:tag[][] = [['paralized'],['before-action']];
  readonly type:string;
  /** TODO doc */
  protected abstract name:string;
  /** What the reaction does when it is triggered */
  protected abstract action(react_character: Character,source:Character,target: Character[]):ActionOutput;
  protected masterService!:MasterService;

  constructor(masterService:MasterService)
  { this.masterService = masterService; }

  /**
   * Checks the tags of the action to see if should trigger the reaction.
   * Then applies the reaction.
   */
  reaction(actionTags: tag[],react_character:Character,source:Character,targets:Character[]): ActionOutput
  {
    //reaction is prevented
    if(this.prevent_reaction.some(prevent_pattern => prevent_pattern.every(tag=>actionTags.includes(tag))))return [[],[]]
      for( const trigger of this.whatTriggers )
      {
          if(trigger.every(tag=>actionTags.includes(tag)))
          {
            //reaction is triggered
            return this.action(react_character,source,targets)
          }
      }
      //reaction is not triggered
      return [[],[]]
  }
  //@ts-ignore
  hash(): string { return this.constructor }
  fromJson(options: ReactionOptions): void { }
  toJson():ReactionOptions
  {
    return {
      Factory:"Reaction",
      type:this.type
    };
  }
}
export abstract class BeforeActionReaction extends Reaction
{
  protected prevent_reaction: tag[][]= [['paralized']]
}

export type ReactionOptions={
  Factory:"Reaction";
  type:string;
  [key: string]:any;
}
