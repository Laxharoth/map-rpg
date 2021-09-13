import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { StatusBattle } from "../StatusBattle";

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
  { return pushBattleActionOutput(super.onStatusRemoved(target),this.applyEffect(target)); }
  get tags(): tag[] { return super.tags.concat(['defend']) }
}
