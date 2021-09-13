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
    return super.applyEffect(target);
  }
  get effectHasEnded():boolean { return this.DURATION<=0; }
  set extraDuration(extra:number){this.DURATION+=extra;}
}
