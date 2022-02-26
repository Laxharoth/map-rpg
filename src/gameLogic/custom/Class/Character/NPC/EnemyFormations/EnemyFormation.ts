import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { MasterService } from "src/app/service/master.service";
import { Enemy } from "src/gameLogic/custom/Class/Character/Enemy/Enemy";
import { Scene, SceneOptions, descriptionString } from "src/gameLogic/custom/Class/Scene/Scene";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { ActionOutput } from '../../Character.type';
import { factoryname } from 'src/gameLogic/configurable/Factory/FactoryMap';

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
   * @type {(Character&Enemy)[]}
   * @memberof EnemyFormation
   */
  protected abstract _enemies:(Character&Enemy)[];
  protected readonly masterService: MasterService;

  /**
   * Creates an instance of EnemyFormation.
   * @param {MasterService} masterService
   * @memberof EnemyFormation
   */
  constructor( masterService:MasterService){this.masterService =masterService;}
  get IsDefeated():boolean{ return this.enemies.every(character=>character.is_defeated()); }
  /**
   * Gets the private array of enemies.
   *
   * @readonly
   * @type {(Character&Enemy)[]}
   * @memberof EnemyFormation
   */
  get enemies():(Character&Enemy)[] {return this._enemies;}

  /**
   * Defines the description if the enemy party win.
   *
   * @abstract
   * @param {Character[]} party The party of the player.
   * @return {Scene}
   * @memberof EnemyFormation
   */
  abstract onEnemyVictory(party: Character[]):Scene;
  /**
   * Defines the description if the enemy party lose.
   *
   * @abstract
   * @param {Character[]} party The party of the player.
   * @return {Scene}
   * @memberof EnemyFormation
   */
  abstract onPartyVictory(party: Character[]):Scene;
  /**
   * Defines the loot the enemyformation will drop when defeated
   *
   * @abstract
   * @return {*}  {Item[]}
   * @memberof EnemyFormation
   */
  loot():GameItem[]
  {
    return this._enemies.reduce((accumulator,enemy)=>accumulator.concat(enemy.loot.map(storeable=>ItemFactory(this.masterService,storeable))),[] as GameItem[])
  }
  give_experience(party: Character[]):ActionOutput
  {
    let experience_str:string[] = []
    for(const party_member of party)
    {
      const experience = party_member.gain_experience(
        this._enemies.reduce((accumulator,enemy)=>accumulator+calculate_experience(enemy,party_member),0)
        )
      experience_str.push(`${party_member.name} gains ${experience} experience`)
    }
    return [[],experience_str]
  }
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
  protected exitOption(exitString:string):SceneOptions
  {
    return {
      text:exitString,
      action:()=>{ this.masterService.sceneHandler.flush(0).nextScene(false); },
      disabled:false
    }
  }

  *[Symbol.iterator](){ for(const enemy of this._enemies)yield enemy; }
}

export type EnemyFormationOptions = {
  Factory:factoryname;
  type: string;
}

function calculate_experience(enemy:Enemy,character: Character):number
{
  return enemy.base_experience;
}
