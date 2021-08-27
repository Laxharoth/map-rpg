import { Status } from "./Status";

export abstract class TimedStatus extends Status{
  protected abstract duration: number;
  get effectHasEnded():boolean
  { return this.duration<=0; }
}
