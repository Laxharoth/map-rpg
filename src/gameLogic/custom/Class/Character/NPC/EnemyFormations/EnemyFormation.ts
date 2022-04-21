import { MasterService } from "src/app/service/master.service";
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { primitive } from 'src/gameLogic/core/types';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Enemy } from "src/gameLogic/custom/Class/Character/Enemy/Enemy";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { ActionOutput } from '../../Character.type';

/**
 * An array of characters, with the functions for battle descriptions.
 */
export abstract class EnemyFormation implements storeable{
  abstract type: primitive;
  /** The Array with the enemies. */
  protected abstract _enemies:(Character&Enemy)[];
  protected readonly masterService: MasterService;
  constructor( masterService:MasterService){this.masterService =masterService;}
  get IsDefeated():boolean{ return this.enemies.every(character=>character.isDefeated()); }
  /** Gets the private array of enemies. */
  get enemies():(Character&Enemy)[] {return this._enemies;}

  /** Defines the scene if the enemy party win.*/
  abstract onEnemyVictory(party: Character[]):Scene;
  /** Defines the scene if the enemy party lose. */
  abstract onPartyVictory(party: Character[]):Scene;
  /** Defines the loot the enemyformation will drop when defeated */
  loot():GameItem[]{
    return this._enemies.reduce((accumulator,enemy)=>accumulator.concat(enemy.loot.map(storeable=>ItemFactory(this.masterService,storeable))),[] as GameItem[])
  }
  give_experience(party: Character[]):ActionOutput{
    let experienceStr:string[] = []
    for(const partyMember of party)
    {
      const experience = partyMember.gainExperience(
        this._enemies.reduce((accumulator,enemy)=>accumulator+calculateExperience(enemy,partyMember),0)
        )
      experienceStr.push(`${partyMember.name} gains ${experience} experience`)
    }
    return [[],experienceStr]
  }
  /** Returns a description of whether escaped or not. */
  attemptEscape(party: Character[]):[string,boolean]{
    if(!this.escapeCheck(party))return [this.escapeFail(),false];
    for(const character of party){character.onEndBattle();}
    this.masterService.gameStateHandler.gameState = 'map'
    return [this.escapeSuccess(),true];
  }

  /** Returs as description of the player party successfully escaped. */
  protected abstract escapeSuccess():string;
  /** Returs as description of the player party failed to escape */
  protected abstract escapeFail():string;
  /** Determine if the player can escape the enemy. */
  protected abstract escapeCheck(party: Character[]):boolean;
  /** A DescriptionOption to get the to the next description. */
  protected exitOption(exitString:string):SceneOptions{
    return {
      text:exitString,
      action:()=>{ this.masterService.sceneHandler.flush(0).nextScene(false); },
      disabled:false
    }
  }
  *[Symbol.iterator](){ for(const enemy of this._enemies)yield enemy; }
  toJson(): EnemyFormationOptions {
    throw new Error('Method not implemented.');
  }
  fromJson(options: EnemyFormationOptions): void { }
}

export type EnemyFormationOptions = {
  Factory:"EnemyFormation";
  type: string;
}

function calculateExperience(enemy:Enemy,character: Character):number{
  return enemy.baseExperience;
}
