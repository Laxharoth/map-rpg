import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

export class StatusSleep extends StatusBattle {
  protected DURATION: number = 4;
  get name(): statusname { return 'Sleep'; }
  get description(): string {
    return "The target can't move.";
  }
  protected effect(target: Character): ActionOutput
  {
      target.roundStats.evasion*=0.8;
      return [[],[`${target.name} is sleeping.`]]
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.roundStats.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized','sleep'])}
}
