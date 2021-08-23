import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { LockMapService } from "../service/lock-map.service";
import { MapHandlerService } from "../service/map-handler.service";
import { Character } from "./Character/Character";

export class MasterService
{
  private _lockmap:LockMapService
  private _descriptionHandler:DescriptionHandlerService
  private _flagsHandler:FlagHandlerService
  private _mapHandler:MapHandlerService
  private _user:Character;
  private _party: [(Character|null),(Character|null)] = [null,null];
  constructor(savename:string)
  {
    this._lockmap = new LockMapService();
    this._descriptionHandler = new DescriptionHandlerService(this._lockmap);
    this._flagsHandler = new FlagHandlerService(savename);
    this._mapHandler = new MapHandlerService(this);
  }
  get lockmap(){return this._lockmap;}
  get descriptionHandler(){return this._descriptionHandler;}
  get flagsHandler(){return this._flagsHandler;}
  get mapHandler(){return this._mapHandler;}

  get user(){return this._user;}
  get party():Character[]{return this._party.filter(character=> character!==null);}

  set user(value:Character){this._user = value;}
  setPartyMember(value:Character,index:number){if([0,1].includes(index))this._party[index] = value;}
}
