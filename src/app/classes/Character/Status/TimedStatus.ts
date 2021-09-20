import { Character } from 'src/app/classes/Character/Character';
import { Subscription } from 'rxjs';
import { Status } from "./Status";
import { MasterService } from '../../masterService';
import { Time } from '../../Time';

export abstract class TimedStatus extends Status{
  protected abstract duration: number;
  protected initialTime: number;
  protected currentTime: number;
  protected timerSubscription:Subscription;
  constructor(masterService:MasterService)
  {
    super(masterService);
    this.initialTime = this.masterService.flagsHandler.minutes;
    this.currentTime = this.initialTime;
  }
  get remainingTime(): number
  { return this.duration - (this.currentTime - this.initialTime); }
  onStatusGainded(target: Character)
  {
    this.timerSubscription = this.masterService.flagsHandler.onTimeChanged().subscribe( time => {
      this.checkRemoveStatus(time, target);
    })
    return super.onStatusGainded(target)
  }

  private checkRemoveStatus(time: Time, target: Character)
  {
    this.currentTime = time.getMinutes();
    if (this.remainingTime <= 0) {
      const [message] = target.removeStatus(this);
      this.masterService.descriptionHandler.tailDescription(message,'map');
    }
  }
  onStatusRemoved(target: Character)
  {
    this.timerSubscription.unsubscribe()
    return super.onStatusRemoved(target)
  }
  toJson():{[key: string]:any}
  {
    return {initialTime:this.initialTime}
  }
  fromJson(options:{[key: string]: any}):void
  {
    const {initialTime} = options;
    this.initialTime = initialTime;
  }
}
