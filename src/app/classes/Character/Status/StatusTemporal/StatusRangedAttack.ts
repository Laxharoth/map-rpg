import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { StatusFight } from "../StatusFight";

export class StatusRangedAttack extends StatusFight
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
  { return pushBattleActionOutput(super.onStatusGainded(target),this.applyEffect(target) )}
  get tags(): tag[] { return super.tags.concat(['aim'])}
}
