import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Status, StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";

/** Specific Status that occur only in battle. */
export abstract class StatusBattle extends Status
{
  /** The number of turns this status last. */
  protected abstract DURATION: number;
  /**
   * Applies the effect to the status, and reduces the duration.
   * If the duration reach zero, removes itself from the character.
   */
  applyEffect(target: Character):ActionOutput
  {
    this.DURATION--;
    if(this.DURATION<=0)return target.removeStatus(this);
    return super.applyEffect(target);
  }
  /** Increases the duration of the status */
  set extraDuration(extra:number){this.DURATION+=extra;}
}

/** Status that check if the character affected by the status can attack the target. */
export interface StatusPreventAttack
{
  /** A discriminator to check if a class implements the interface. */
  discriminator:'StatusPreventAttack';
  /** Determinate if the character affected by the status can attack the target. */
  canAttack(target:Character):boolean;
  /** Gets a description if the character can not attack the target. */
  preventAttackDescription(target:Character):ActionOutput;
}
/** Checks if a status implements StatusPreventAttack. */
export function isStatusPreventAttack(object:any):boolean { return object.discriminator === 'StatusPreventAttack'; }
