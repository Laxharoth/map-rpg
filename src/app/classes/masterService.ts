import { DescriptionHandlerService } from "../service/description-handler.service";
import { EnemyFormationService } from "../service/enemy-formation.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { LockMapService } from "../service/lock-map.service";
import { MapHandlerService } from "../service/map-handler.service";
import { PartyService } from "../service/party.service";
import { Character } from "./Character/Character";

export class MasterService
{
  private _lockmap:LockMapService
  private _descriptionHandler:DescriptionHandlerService
  private _flagsHandler:FlagHandlerService
  private _mapHandler:MapHandlerService
  private _partyHandler:PartyService
  private _enemyHandler:EnemyFormationService

  constructor(savename:string)
  {
    this._lockmap = new LockMapService();
    this._descriptionHandler = new DescriptionHandlerService(this._lockmap);
    this._flagsHandler = new FlagHandlerService(savename);
    this._mapHandler = new MapHandlerService(this);
    this._partyHandler = new PartyService();
    this._enemyHandler = new EnemyFormationService();
  }
  get lockmap(){return this._lockmap;}
  get descriptionHandler(){return this._descriptionHandler;}
  get flagsHandler(){return this._flagsHandler;}
  get mapHandler(){return this._mapHandler;}
  get partyHandler(){return this._partyHandler;}
  get enemyHandler(){return this._enemyHandler;}

  updateCharacter(character:Character):void
  {
    if(character===this.partyHandler.user) return this.partyHandler.updateUser()
    for(let partyIndeX = 0; partyIndeX < this.partyHandler.party?.length; partyIndeX++)
    if(this.partyHandler.party[partyIndeX]===character)return this.partyHandler.updatePartyMember(partyIndeX)
    for(let enemyIndeX = 0; enemyIndeX < this.enemyHandler.enemyFormation?.enemies.length; enemyIndeX++)
    if(this.enemyHandler.enemyFormation.enemies[enemyIndeX]===character)return this.enemyHandler.updateEnemy(enemyIndeX)
  }
}
