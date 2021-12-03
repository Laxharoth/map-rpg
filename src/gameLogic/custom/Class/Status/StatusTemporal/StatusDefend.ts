import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusDefend extends StatusBattle
{
  protected DURATION: number = 1;
  get name(): statusname { return 'Defend'; }
  get description(): string { return 'Increases defence and evasion.'; }
  protected effect(target: Character): ActionOutput {
    target.roundStats.defence*=(target.hasTag('no shield'))?1.2:1.7;
    target.roundStats.evasion*=1.3;
    return [[],[`${target.name} raises it's defence.`]];
  }
  onStatusGainded(target: Character):ActionOutput
  { return pushBattleActionOutput(super.onStatusGainded(target),this.effect(target)); }
  get tags(): tag[] { return super.tags.concat(['defend']) }
}
