import { Inject, Injectable, OnChanges } from '@angular/core';
import { flags } from '../flags/flags';
import { Observable, Subject } from 'rxjs';
import { Time } from '../classes/Time';
import { MasterService } from "src/app/service/master.service";
import { CharacterFactory } from '../classes/Character/Factory/CharacterFactory';
import { loadPersistentNames, savePersistentNames } from '../classes/Character/Factory/LoadPersistentCharacters';

/**
 * Service to modify flags, but also to modifiy ingame time.
 *
 * @export
 * @class FlagHandlerService
 */
@Injectable({
  providedIn: 'root'
})
export class FlagHandlerService {

  /**
   * The game flags
   *
   * @private
   * @type {{[key: string]:any}}
   * @memberof FlagHandlerService
   */
  private gameFlags:{[key: string]:any} = flags;
  /**
   * The ingame time.
   *
   * @private
   * @type {Time}
   * @memberof FlagHandlerService
   */
  private time:Time;
  /**
   * Subject to check flags changes.
   *
   * @private
   * @memberof FlagHandlerService
   */
  private flagsSubject = new Subject<string>();
  /**
   * Subject to check time changes.
   *
   * @private
   * @memberof FlagHandlerService
   */
  private timeSubject = new Subject<Time>();

  constructor() {
    this.time = new Time(this.getFlag("time"));
  }

  /**
   * Sets the value of a flag.
   *
   * @param {string} key The name of the flag.
   * @param {*} value The value to set.
   * @return {*}
   * @memberof FlagHandlerService
   */
  setFlag(key: string, value: any):void
  {
    if(!this.gameFlags[key]===undefined)
    {
      console.warn(`Invalid Flag ${key}`);
      return;
    }
    this.gameFlags[key] = value;
    this.flagsSubject.next(key);
  }

  /**
   * Gets the value of the flag.
   *
   * @param {string} key The name of the flag.
   * @return {*}  {*} The value of the flag.
   * @memberof FlagHandlerService
   */
  getFlag(key:string):any
  {
    return this.gameFlags[key];
  }

  /**
   * Returns and observable that gives the name of the flag that changed.
   *
   * @return {*}
   * @memberof FlagHandlerService
   */
  onFlagChanged():Observable<string>
  {
    return this.gameFlags.asObservable();
  }

  /**
   * Sets all the game flags
   *
   * @param {{[key: string]:any}} gameFlags
   * @memberof FlagHandlerService
   */
  setFlags(gameFlags:{[key: string]:any})
  {
    this.gameFlags = gameFlags;
    this.flagsSubject.next("NEW SET OF FLAGS LOADED");
  }

  /**
   * Saves the game state.
   *
   * @param {string} savename The name of the savefile.
   * @param {MasterService} masterService The master service.
   * @memberof FlagHandlerService
   */
  save(savename: string, masterService: MasterService)
  {
    const savefile = {};
    const character = masterService.partyHandler.user;
    savefile['flags']=this.gameFlags;
    savefile['character'] = character.toJson();
    savefile['persisten'] = savePersistentNames(masterService.partyHandler.persistents)
    console.log(savefile);
    localStorage.setItem(savename,JSON.stringify(savefile));
  }

  /**
   * Loads the game state.
   *
   * @param {string} savename The name of the savefile.
   * @param {MasterService} masterService The master service.
   * @memberof FlagHandlerService
   */
  load(savename: string, masterService: MasterService)
  {
    const savefile = JSON.parse(localStorage.getItem(savename));
    if(savefile)
    {
      console.log(savefile);
      masterService.partyHandler.user = CharacterFactory(masterService,savefile['character']['type'],savefile['character']);
      masterService.partyHandler.persistents = loadPersistentNames(masterService,savefile['persistent']);
      this.gameFlags = savefile['flags'];
      this.time = new Time(this.getFlag("time"));
    }
    else
    {
      this.gameFlags = flags;
    }
    const fullkeys = Object.keys(flags);
    if(fullkeys.join()!==Object.keys(this.gameFlags).join())
    {
      for(const key of fullkeys)
      {
        if(this.gameFlags[key]===null || this.gameFlags[key]===undefined)
          this.gameFlags[key] = flags[key];
      }
    }
  }

  //Time Operations
  /**
   * Adds time to the current ingame time.
   *
   * @param {(number|string)} time The time to increase.
   * @memberof FlagHandlerService
   */
  addTime( time: number|string)
  {
    this.time.addTime(time);
    this.gameFlags.time = this.time.getMinutes();
    this.timeSubject.next(this.time);
  }
  /**
   * Returns an observable to observe when the time changes.
   *
   * @return {*}  {Observable<Time>}
   * @memberof FlagHandlerService
   */
  onTimeChanged():Observable<Time>
  {
    return this.timeSubject.asObservable();
  }

  /**
   * Gest the current ingame time values.
   *
   * @return {*}
   * @memberof FlagHandlerService
   */
  getTimeValues()
  {
    return this.time.getTimeValues();
  }
  /**
   * Returns the current ingame time in minutes.
   *
   * @readonly
   * @memberof FlagHandlerService
   */
  get minutes(){return this.time.getMinutes();}
}
