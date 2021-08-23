import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../Character";
import { Status } from "./Status";

export abstract class TimedStatus extends Status{
  protected abstract duration: number;
  abstract get name(): string;
  abstract get description(): string;
  abstract onEffectEnded():battleActionOutput;
  protected abstract effect(target: Character):battleActionOutput;
  applyEffect(target: Character):battleActionOutput
  {
    const effect = this.effect(target);
    return effect;
  }
  get effectHasEnded():boolean
  {
    return this.duration<=0;
  }
}
