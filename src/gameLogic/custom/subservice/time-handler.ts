import { Observable, Subject, Subscription } from "rxjs";
import { Time, TimeValues } from "src/gameLogic/custom/ClassHelper/Time";

import { FlagHandlerService } from "src/gameLogic/core/subservice/flag-handler";

export class TimeHandler {
  /** The ingame time. */
  private time: Time;
  private timeSubject = new Subject<Time>();
  private gameFlagTime:number;
  private AllFlagsChangeSubscription:Subscription;

  constructor(flagsHandler:FlagHandlerService) {
    this.time = new Time(flagsHandler.getFlag("time"));
    Object.defineProperty(this, "gameFlagTime", {
      get: () => this.time.getMinutes(),
      set:(value:number) =>{flagsHandler.setFlag("time",this.time.getMinutes())}
    })
  }
  /**
   * Adds time to the current ingame time.
   *
   * @param {(number|string)} time The time to increase.
   * @memberof FlagHandlerService
   */
  addTime(time: number | string) {
    this.time.addTime(time);
    this.gameFlagTime = this.time.getMinutes();
    this.timeSubject.next(this.time);
  }
  /**
   * Returns an observable to observe when the time changes.
   *
   * @return {*}  {Observable<Time>}
   * @memberof FlagHandlerService
   */
  onTimeChanged(): Observable < Time > {
    return this.timeSubject.asObservable();
  }

  /**
   * Gest the current ingame time values.
   *
   * @return {*}
   * @memberof FlagHandlerService
   */
  getTimeValues():TimeValues {
    return this.time.getTimeValues();
  }
  /**
   * Returns the current ingame time in minutes.
   *
   * @readonly
   * @memberof FlagHandlerService
   */
  get minutes() {
    return this.time.getMinutes();
  }
}
