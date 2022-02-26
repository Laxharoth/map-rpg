import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Time } from 'src/gameLogic/custom/ClassHelper/Time';
import { ActionOutput } from '../Character/Character.type';
import { Status } from "./Status";

/**
 * A status that last an amount of ingame time.
 *
 * @export
 * @abstract
 * @class TimedStatus
 * @extends {Status} Adds the duration of the status.
 * @constructor Initializes the masterService and initialTime
 */
export abstract class TimedStatus extends Status{
  /**
   * The duration of the status.
   *
   * @protected
   * @abstract
   * @type {number}
   * @memberof TimedStatus
   */
  protected abstract duration: number;
  /**
   * The time ingame the status was added to the character.
   *
   * @protected
   * @type {number}
   * @memberof TimedStatus
   */
  protected initialTime: number;
  protected currentTime: number;
  protected timerSubscription:Subscription;
  /**
   * A status that last an amount of ingame time.
   *
   * @param {MasterService} masterService
   * @memberof TimedStatus
   */
  constructor(masterService:MasterService)
  {
    super(masterService);
    this.initialTime = this.masterService.timeHandler.minutes;
    this.currentTime = this.initialTime;
  }
  /**
   * Get the remaining time in minutes.
   *
   * @readonly
   * @type {number}
   * @memberof TimedStatus
   */
  get remainingTime(): number
  { return this.duration - (this.currentTime - this.initialTime); }
  /**
   * Initializes a subscription to check if should remove itself when the ingame time changes.
   *
   * @param {Character} target The character with the status.
   * @return { ActionOutput }
   * @memberof TimedStatus
   */
  onStatusGainded(target: Character)
  {
    this.timerSubscription = this.masterService.timeHandler.onTimeChanged().subscribe( time => {
      this.checkRemoveStatus(time, target);
    })
    return super.onStatusGainded(target)
  }
  /**
   * Removes the status and inserts the scene to the list if the duration reaches zero.
   *
   * @private
   * @param {Time} time The current time.
   * @param {Character} target The character with the status.
   * @memberof TimedStatus
   */
  private checkRemoveStatus(time: Time, target: Character)
  {
    this.currentTime = time.getMinutes();
    if (this.remainingTime <= 0) {
      const [message] = target.removeStatus(this);
      this.masterService.sceneHandler.headScene(message,'status').setScene(false);
    }
  }
  /**
   * Unsubscribe from the flag Service .onTimeChanged()
   *
   * @param {Character} target The character with the status.
   * @return { ActionOutput }
   * @memberof TimedStatus
   */
  onStatusRemoved(target: Character):ActionOutput
  {
    this.timerSubscription.unsubscribe()
    return super.onStatusRemoved(target)
  }
  /**
   * Saves the initialTime
   *
   * @return { StatusStoreable }
   * @memberof TimedStatus
   */
  toJson()
  {
    const storeable = super.toJson();
    storeable.initialTime = this.initialTime;
    return storeable;
  }
  /**
   * loads the initial time.
   *
   * @param {{[key: string]: any}} options
   * @memberof TimedStatus
   */
  fromJson(options:{[key: string]: any}):void
  {
    const {initialTime} = options;
    this.initialTime = initialTime;
  }
}
