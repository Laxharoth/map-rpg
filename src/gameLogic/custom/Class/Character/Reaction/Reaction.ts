import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { hashable } from "src/gameLogic/custom/ClassHelper/ObjectSet";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * A Reaction for characters to do something after an action affects them.
 *
 * @export
 * @abstract
 * @class Reaction
 * @constructor Initializes the masterService
 */
export abstract class Reaction implements hashable{
  /** The list of tags the reaction should be triggered with. */
  protected abstract whatTriggers: tag[][];
  /** The list of tags the reaction should be never trigger. */
  protected prevent_reaction:tag[][] = [['paralized'],['before-action']];
  /**
   * What the reaction does when it is triggered
   *
   * @protected
   * @abstract
   * @param {Character} react_character The character who reacts
   * @param {Character} source The character whose action triggered the reaction.
   * @param {Character} target The character that does the reaction.
   * @return {*}  {ActionOutput}
   * @memberof Reaction
   */
  protected abstract action(react_character: Character,source:Character,target: Character[]):ActionOutput;
  protected masterService!:MasterService;

  /**
   * Creates an instance of Reaction.
   * @param {MasterService} masterService
   * @memberof Reaction
   */
  constructor(masterService:MasterService)
  { this.masterService = masterService; }

  /**
   * Checks the tags of the action to see if should trigger the reaction.
   * Then applies the reaction.
   *
   * @param {tag[]} actionTags The tags of the action to react to.
   * @param {Character} react_character The character who reacts
   * @param {Character} source The character whose action should trigger the reaction.
   * @param {Character} targets The character who is going to be affected by the action.
   * @return {*}  {ActionOutput}
   * @memberof Reaction
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
}

export abstract class BeforeActionReaction extends Reaction
{
  protected prevent_reaction: tag[][]= [['paralized']]
}
