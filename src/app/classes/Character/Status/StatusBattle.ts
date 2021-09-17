import { ActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../Character";
import { Status } from "./Status";

export abstract class StatusBattle extends Status
{
  //constant
  protected abstract DURATION: number;
  applyEffect(target: Character):ActionOutput
  {
    this.DURATION--;
    if(this.DURATION<=0)return target.removeStatus(this);
    return super.applyEffect(target);
  }
  get effectHasEnded():boolean { return this.DURATION<=0; }
  set extraDuration(extra:number){this.DURATION+=extra;}
}

export interface StatusPreventAttack
{
  discriminator:'StatusPreventAttack';
  canAttack(target:Character):boolean;
  preventAttackDescription(target:Character):ActionOutput;
}

export function isStatusPreventAttack(object:any) { return object.discriminator === 'StatusPreventAttack'; }
