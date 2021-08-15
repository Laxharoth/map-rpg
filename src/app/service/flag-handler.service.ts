import { Inject, Injectable } from '@angular/core';
import { flags } from '../flags/flags';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagHandlerService {

  private gameFlags:{[key: string]:any} = flags;
  private flagsSubject = new Subject<string>();

  constructor(@Inject(String)savename:string) {
    this.load(savename);
  }

  setFlag(key: string, value: any)
  {
    if(!this.gameFlags?.[key])
    {
      console.log(`Invalid Flag ${key}`);
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

  save(savename: string)
  {
    localStorage.setItem(savename,JSON.stringify(this.gameFlags));
  }

  load(savename: string)
  {
    this.gameFlags = JSON.parse(localStorage.getItem(savename));
    if(!this.gameFlags)
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
}
