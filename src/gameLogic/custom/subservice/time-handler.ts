import { Observable, Subject } from "rxjs";
import { Time, TimeValues } from "src/gameLogic/custom/ClassHelper/Time";

import { GameSaver } from "src/gameLogic/core/subservice/game-saver";
import { Storeable } from "src/gameLogic/core/Factory/Factory";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { MasterService } from "src/app/service/master.service";
export class TimeHandler implements Storeable{
  /** The ingame time. */
  type:'TimeHandler'='TimeHandler';
  private time: Time = new Time(0);
  private timeSubject = new Subject<Time>();
  constructor(gameSaver:GameSaver) {
    gameSaver.register("TimeHandler",this);
  }
  /** Adds time to the current ingame time. */
  addTime(time: number | string) {
    this.time.addTime(time);
    this.timeSubject.next(this.time);
  }
  /** Returns an observable to observe when the time changes. */
  onTimeChanged(): Observable < Time > {
    return this.timeSubject.asObservable();
  }
  /** Gets the current ingame time values. */
  getTimeValues():TimeValues {
    return this.time.getTimeValues();
  }
  /** Returns the current ingame time in minutes. */
  get minutes() {
    return this.time.getMinutes();
  }
  fromJson(options: timeHandlerStoreable): void {
    if(options)
      this.time.setTime(options.minutes)
  }
  toJson(): timeHandlerStoreable {
      return{
        Factory: "TimeHandler",
        type: "time",
        minutes:this.time.getMinutes(),
      }
  }
}
export const SetTimeHandler:FactoryFunction<void,timeHandlerStoreable> = (masterService,options)=>{
  masterService.timeHandler.fromJson(options)
}
type timeHandlerStoreable = {
  Factory: "TimeHandler";
  type: "time";
  minutes:number;
}
