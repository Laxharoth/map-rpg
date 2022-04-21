import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { CalculatedStats } from '../../Character/Character.type';
import { StatusBattle } from "../StatusBattle";

export class StatusRangedAttack extends StatusBattle
{
  private target!:Character;
  protected DURATION: number = 1;
  readonly type:"StatusRangedAttack" = "StatusRangedAttack"
  get name(): string { return 'Ranged Attack'; }
  get description(): string {
    return 'Using a ranged attack puts space between you and the enemy.\nIncreased evasion by 10%.';
  }
  // @ts-ignore
  protected get _stats_modifier(): CalculatedStats{
    return {evasion:(5 + 3/5 * this.target.coreStats.speed)*1.10};
  };
  onStatusGainded(target: Character)
  {
    this.target = target;
    return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} takes some space to shoot.`]] )
  }
  get tags(): tag[] { return super.tags.concat(['aim'])}
}
