import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusSleep extends StatusBattle {
  protected DURATION: number = 4;
  get name(): statusname { return 'Sleep'; }
  get description(): string {
    return "The target can't move.";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is sleeping.`]] }
  applyModifiers(character: Character): void { character.calculated_stats.evasion*=0.8; }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.calculated_resistance.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized','sleep'])}
}
