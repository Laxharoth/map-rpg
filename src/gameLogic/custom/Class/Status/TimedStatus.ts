import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Time } from 'src/gameLogic/custom/ClassHelper/Time';
import { ActionOutput } from '../Character/Character.type';
import { Status, StatusStoreable } from "./Status";

/** A status that last an amount of ingame time. */
export abstract class TimedStatus extends Status{
  /** The duration of the status. */
  protected abstract duration: number;
  /** The time ingame the status was added to the character. */
  protected initialTime: number;
  protected currentTime: number;
  protected timerSubscription:Subscription|null=null;
  /** A status that last an amount of ingame time. */
  constructor(masterService:MasterService){
    super(masterService);
    this.initialTime = this.masterService.timeHandler.minutes;
    this.currentTime = this.initialTime;
  }
  /** Get the remaining time in minutes. */
  get remainingTime(): number{
    return this.duration - (this.currentTime - this.initialTime);
  }
  /** Initializes a subscription to check if should remove itself when the ingame time changes. */
  onStatusGainded(target: Character){
    this.timerSubscription = this.masterService.timeHandler.onTimeChanged().subscribe( time => {
      this.checkRemoveStatus(time, target);
    })
    return super.onStatusGainded(target)
  }
  /** Removes the status and inserts the scene to the list if the duration reaches zero. */
  private checkRemoveStatus(time: Time, target: Character){
    this.currentTime = time.getMinutes();
    if (this.remainingTime <= 0) {
      const [message] = target.removeStatus(this);
      this.masterService.sceneHandler.headScene(message,'status').setScene(false);
    }
  }
  /** Unsubscribe from the flag Service .onTimeChanged() */
  onStatusRemoved(target: Character):ActionOutput{
    if(this.timerSubscription){ this.timerSubscription.unsubscribe(); }
    return super.onStatusRemoved(target)
  }
  /** Saves the initialTime */
  toJson(): StatusStoreable{
    const storeable = super.toJson();
    storeable.initialTime = this.initialTime;
    return storeable;
  }
  /** loads the initial time. */
  fromJson(options:{[key: string]: any}):void{
    const {initialTime} = options;
    this.initialTime = initialTime;
  }
}
