import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { StatusBattle } from "../StatusBattle";

export class StatusRangedAttack extends StatusBattle
{
  protected DURATION: number = 1;
  get name(): statusname {
    return 'Ranged Attack';
  }
  get description(): string {
    return 'Using a ranged attack puts space between you and the enemy.\nIncreased evasion by 10%.';
  }
  protected effect(target: Character): ActionOutput {
    target.roundStats.evasion+= 5 + 3/5 * target.originalstats.speed;
    target.roundStats.evasion*=1.10;
    return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} takes some space to shoot.`]]);
  }
  onStatusGainded(target: Character)
  { return pushBattleActionOutput(super.onStatusGainded(target),this.effect(target) )}
  get tags(): tag[] { return super.tags.concat(['aim'])}
}
