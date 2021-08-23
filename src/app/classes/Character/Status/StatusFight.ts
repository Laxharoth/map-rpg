import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../Character";
import { Status } from "./Status";

export abstract class StatusFight extends Status
{
  //constant
  protected abstract DURATION: number;
  abstract get name(): string;
  abstract get description(): string;
  /**
   * Defines what effects will be applied to the character.
   * @param target The Character that will be affected by the status
   * @return A message describing what the status does, null if should not show a message.
   */
  protected abstract effect(target: Character):battleActionOutput;
  /**
   * Applies effects in a character.
   * @param target The Character that will be affected by the status
   * @return A message describing what the status does, null if should not show a message.
   */
  applyEffect(target: Character):battleActionOutput
  {
    const effect = this.effect(target);
    this.DURATION--;
    return effect;
  }
  get effectHasEnded():boolean { return this.DURATION<=0; }
  onEffectEnded(target: Character)  :battleActionOutput{return [[],[]];};
}
