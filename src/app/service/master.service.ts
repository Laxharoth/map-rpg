import { Injectable } from '@angular/core';
import { Character } from '../classes/Character/Character';
import { DescriptionHandlerService } from "../service/description-handler.service";
import { EnemyFormationService } from "../service/enemy-formation.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { GameStateService } from "../service/game-state.service";
import { LockMapService } from "../service/lock-map.service";
import { MapHandlerService } from "../service/map-handler.service";
import { PartyService } from "../service/party.service";


@Injectable({
  providedIn: 'root'
})

/**
 * A object to pack all services
 *
 * @export
 * @class MasterService
 */
export class MasterService
{
  private _lockmap:LockMapService
  private _descriptionHandler:DescriptionHandlerService
  private _flagsHandler:FlagHandlerService
  private _mapHandler:MapHandlerService
  private _partyHandler:PartyService
  private _enemyHandler:EnemyFormationService
  private _gameStateHandler:GameStateService

  constructor()
  {
    this._lockmap = new LockMapService();
    this._flagsHandler = new FlagHandlerService();
    this._partyHandler = new PartyService();
    this._enemyHandler = new EnemyFormationService();
    this._gameStateHandler = new GameStateService();
    this._descriptionHandler = new DescriptionHandlerService(this._lockmap,this._gameStateHandler);
    this._mapHandler = new MapHandlerService(this);
  }
  get lockmap(){return this._lockmap;}
  get descriptionHandler(){return this._descriptionHandler;}
  get flagsHandler(){return this._flagsHandler;}
  get mapHandler(){return this._mapHandler;}
  get partyHandler(){return this._partyHandler;}
  get enemyHandler(){return this._enemyHandler;}
  get gameStateHandler(){return this._gameStateHandler;}

  updateCharacter(character:Character):void
  {
    if(character===this.partyHandler.user) return this.partyHandler.updateUser()

    for(let partyIndeX = 0; partyIndeX < this.partyHandler.party?.length; partyIndeX++)
    if(this.partyHandler.party[partyIndeX]===character)return this.partyHandler.updatePartyMember(partyIndeX)

    for(let enemyIndeX = 0; enemyIndeX < this.enemyHandler.enemyFormation?.enemies.length; enemyIndeX++)
    if(this.enemyHandler.enemyFormation.enemies[enemyIndeX]===character)return this.enemyHandler.updateEnemy(enemyIndeX)
  }
}
