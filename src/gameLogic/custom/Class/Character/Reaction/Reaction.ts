import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * A Reaction for characters to do something after an action affects them.
 *
 * @export
 * @abstract
 * @class Reaction
 * @constructor Initializes the masterService
 */
export abstract class Reaction{
  /**
   * The list of tags the reaction should be triggered with.
   *
   * @protected
   * @abstract
   * @type {tag[][]}
   * @memberof Reaction
   * @constructor Initializes the masterService
   */
  protected abstract whatTriggers: tag[][];
  /**
   * What the reaction does when it is triggered
   *
   * @protected
   * @abstract
   * @param {Character} source The character whose action triggered the reaction.
   * @param {Character} target The character that does the reaction.
   * @return {*}  {ActionOutput}
   * @memberof Reaction
   */
  protected abstract action(source:Character,target: Character):ActionOutput;
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
   * @param {Character} source The character whose action should trigger the reaction.
   * @param {Character} target The character who does the reaction.
   * @return {*}  {ActionOutput}
   * @memberof Reaction
   */
  reaction(actionTags: tag[],source:Character,target:Character):ActionOutput
  {
      for( const trigger of this.whatTriggers )
      {
          if(trigger.every(tag=>actionTags.includes(tag)))
          { return this.action(source,target); }
      }
      return [[],[]]
  }
}
