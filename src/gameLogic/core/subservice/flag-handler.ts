import { Observable, Subject } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { default_flags, flagname } from 'src/gameLogic/configurable/subservice/flag-handler.type';
import { storeable, StoreableType } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';

/**
 * Service to modify flags, but also to modifiy ingame time.
 *
 * @export
 * @class FlagHandlerService
 * @implements {storeable}
 */
export class FlagHandlerService implements storeable{
  readonly type:"FlagHandlerService"="FlagHandlerService";
  /** The game flags */
  private gameFlags: { [key: string]: any; } = default_flags;
  /** Subject to check flags changes. */
  private flagsSubject:Subject<flagname|"ALL">;

  constructor(gameSaver: GameSaver) {
    gameSaver.register("Flags",this)
  }
  toJson(): FlagsOptions {
    return {Factory:"Flags",type:"Flags",flags:this.gameFlags}
  }
  fromJson(options: FlagsOptions): void {
    this.gameFlags = options.flags;
  }

  /**
   * Sets the value of a flag.
   *
   * @param {string} key The name of the flag.
   * @param {*} value The value to set.
   * @return {*}
   * @memberof FlagHandlerService
   */
  setFlag(key: flagname, value: any):void
  {
    if(!this.gameFlags[key]===undefined)
    {
      console.warn(`Invalid Flag ${key}`);
      return;
    }
    this.gameFlags[key] = value;
    if(this.flagsSubject)this.flagsSubject.next(key);
  }

  /**
   * Gets the value of the flag.
   *
   * @param {string} key The name of the flag.
   * @return {*}  {*} The value of the flag.
   * @memberof FlagHandlerService
   */
  getFlag(key:flagname):any
  {
    return this.gameFlags[key];
  }

  /**
   * Returns and observable that gives the name of the flag that changed.
   *
   * @return {*}
   * @memberof FlagHandlerService
   */
  onFlagChanged():Observable<flagname|"ALL">
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
    if(!this.flagsSubject)this.flagsSubject=new Subject<flagname|"ALL">()
    this.flagsSubject.next("ALL");
  }
}

export const MasterFlagsSetter:FactoryFunction = (masterService:MasterService, options:FlagsOptions) => {
    masterService.flagsHandler.fromJson(options);
  }
export type FlagsOptions = {Factory:"Flags";type:"Flags";flags:{[key : string]:any}}
