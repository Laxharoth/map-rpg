import { Observable, Subject } from 'rxjs';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { defaultFlags, flagname } from 'src/gameLogic/configurable/subservice/flag-handler.type';
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';

/**
 * Service to modify flags, but also to modifiy ingame time.
 */
export class FlagHandlerService implements Storeable{
  readonly type:"FlagHandlerService"="FlagHandlerService";
  /** The game flags */
  private gameFlags = defaultFlags;
  /** Subject to check flags changes. */
  private flagsSubject=new Subject<flagname|"ALL">();

  constructor(gameSaver: GameSaver) {
    gameSaver.register("Flags",this)
  }
  toJson(): FlagsOptions {
    return {Factory:"Flags",type:"Flags",flags:this.gameFlags}
  }
  fromJson(options: FlagsOptions): void {
    this.setFlags(options.flags as typeof defaultFlags);
  }

  /** Sets the value of a flag. */
  setFlag(key: flagname, value: any):void{
    if(!this.gameFlags[key]===undefined){
      console.warn(`Invalid Flag ${key}`);
      return;
    }
    this.gameFlags[key] = value;
    this.flagsSubject.next(key);
  }

  /** Gets the value of the flag. */
  getFlag(key:flagname):any{
    return this.gameFlags[key];
  }

  /** Returns and observable that gives the name of the flag that changed. */
  onFlagChanged():Observable<flagname|"ALL">{
    return this.flagsSubject.asObservable();
  }

  /** Sets all the game flags */
  setFlags(gameFlags:typeof defaultFlags){
    this.gameFlags = gameFlags;
    this.flagsSubject.next("ALL");
  }
}

export const MasterFlagsSetter:FactoryFunction<void,FlagsOptions> = (masterService, options) => {
    masterService.flagsHandler.fromJson(options);
}
export type FlagsOptions = {Factory:"Flags";type:"Flags";flags:{[key : string]:any}}
