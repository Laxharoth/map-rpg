import { Inject, Injectable } from '@angular/core';
import { flags } from '../flags/flags';
import { Observable, Subject } from 'rxjs';
import { Time } from '../classes/Time';
import { MasterService } from '../classes/masterService';
import { CharacterFactory } from '../classes/Character/Factory/CharacterFactory';

@Injectable({
  providedIn: 'root'
})
export class FlagHandlerService {

  private gameFlags:{[key: string]:any} = flags;
  private time:Time;
  private flagsSubject = new Subject<string>();
  private timeSubject = new Subject<Time>();

  constructor() {
    this.time = new Time(this.getFlag("time"));
  }

  setFlag(key: string, value: any)
  {
    if(!this.gameFlags[key]===undefined)
    {
      console.warn(`Invalid Flag ${key}`);
      return;
    }
    this.gameFlags[key] = value;
    this.flagsSubject.next(key);
  }

  getFlag(key:string):any
  {
    return this.gameFlags[key];
  }

  onFlagChanged()
  {
    return this.gameFlags.asObservable();
  }

  setFlags(gameFlags:{[key: string]:any})
  {
    this.gameFlags = gameFlags;
    this.flagsSubject.next("NEW SET OF FLAGS LOADED");
  }

  save(savename: string, masterService: MasterService)
  {
    const savefile = {};
    const character = masterService.partyHandler.user;
    savefile['flags']=this.gameFlags;
    savefile['character'] = character.toJson();
    console.log(savefile);
    localStorage.setItem(savename,JSON.stringify(savefile));
  }

  load(savename: string, masterService: MasterService)
  {
    const savefile = JSON.parse(localStorage.getItem(savename));
    if(savefile)
    {
      console.log(savefile);
      masterService.partyHandler.user = CharacterFactory(masterService,savefile['character']['type'],savefile['character']);
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
  addTime( time: number|string)
  {
    this.time.addTime(time);
    this.gameFlags.time = this.time.getMinutes();
    this.timeSubject.next(this.time);
  }

  onTimeChanged():Observable<Time>
  {
    return this.timeSubject.asObservable();
  }

  getTimeValues()
  {
    return this.time.getTimeValues();
  }

  get minutes(){return this.time.getMinutes();}
}
