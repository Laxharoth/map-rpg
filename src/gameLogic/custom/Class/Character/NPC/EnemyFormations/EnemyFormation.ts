import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Description, DescriptionOptions, descriptionString } from "src/gameLogic/custom/Class/Descriptions/Description";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";

/**
 * An array of characters, with the functions for battle descriptions.
 *
 * @export
 * @abstract
 * @class EnemyFormation
 * @constructor Initializes the masterService
 */
export abstract class EnemyFormation
{
  /**
   * The Array with the enemies.
   *
   * @protected
   * @abstract Can be initialize directly or in the constructor.
   * @type {Character[]}
   * @memberof EnemyFormation
   */
  protected abstract _enemies:Character[];
  protected readonly masterService: MasterService;

  /**
   * Creates an instance of EnemyFormation.
   * @param {MasterService} masterService
   * @memberof EnemyFormation
   */
  constructor( masterService:MasterService){this.masterService =masterService;}
  get IsDefeated():boolean{ return this.enemies.every(character=>character.current_energy_stats.hitpoints<=0); }
  /**
   * Gets the private array of enemies.
   *
   * @readonly
   * @type {Character[]}
   * @memberof EnemyFormation
   */
  get enemies():Character[] {return this._enemies;}

  /**
   * Defines the description if the enemy party win.
   *
   * @abstract
   * @param {Character[]} party The party of the player.
   * @return {Description}
   * @memberof EnemyFormation
   */
  abstract onEnemyVictory(party: Character[]):Description;
  /**
   * Defines the description if the enemy party lose.
   *
   * @abstract
   * @param {Character[]} party The party of the player.
   * @return {Description}
   * @memberof EnemyFormation
   */
  abstract onPartyVictory(party: Character[]):Description;
  /**
   * Defines the loot the enemyformation will drop when defeated
   *
   * @abstract
   * @return {*}  {Item[]}
   * @memberof EnemyFormation
   */
  abstract loot():GameItem[];
  /**
   * Returns a description of whether escaped or not.
   *
   * @param {Character[]} party The player party
   * @return {*}  {[()=>string,boolean]} the description text and if the escape wass successfull
   * @memberof EnemyFormation
   */
  attemptEscape(party: Character[]):[descriptionString,boolean]
  {
    if(!this.escapeCheck(party))return [this.escapeFail(),false];
    for(const character of party){character.onEndBattle();}
    this.masterService.gameStateHandler.gameState = 'map'
    return [this.escapeSuccess(),true];
  }

  /**
   * Returs as description of the player party successfully escaped.
   *
   * @protected
   * @abstract
   * @return {*}  {Description}
   * @memberof EnemyFormation
   */
  protected abstract escapeSuccess():descriptionString;
  /**
   * Returs as description of the player party failed to escape
   *
   * @protected
   * @abstract
   * @return {*}  {Description}
   * @memberof EnemyFormation
   */
  protected abstract escapeFail():descriptionString;
  /**
   * Determine if the player can escape the enemy.
   *
   * @protected
   * @abstract
   * @param {Character[]} party The party of the player.
   * @return {*}  {boolean}
   * @memberof EnemyFormation
   */
  protected abstract escapeCheck(party: Character[]):boolean;
  /**
   * A DescriptionOption to get the to the next description.
   *
   * @protected
   * @param {string} exitString The string displayed on the button.
   * @return {*}  {DescriptionOptions}
   * @memberof EnemyFormation
   */
  protected exitOption(exitString:string):DescriptionOptions
  {
    return new DescriptionOptions(exitString,()=>{
      this.masterService.descriptionHandler.flush(0).nextDescription(false);
    })
  }
}
