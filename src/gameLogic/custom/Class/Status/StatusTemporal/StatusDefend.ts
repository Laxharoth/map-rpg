import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusDefend extends StatusBattle{
  private target!: Character;
  protected DURATION: number = 1;
  readonly type:"StatusDefend"="StatusDefend";
  get name(): string { return 'Defend'; }
  get description(): string { return 'Increases defence and evasion.'; }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} raises it's defence.`]]; }
  onStatusGainded(target: Character):ActionOutput{
    this.target = target
    return pushBattleActionOutput(super.onStatusGainded(target),this.effect(target));
  }
  get tags(): tag[] { return super.tags.concat(['defend']) }
  protected get _stats_modifier():CalculatedStats{
    return {
      physical_defence : this.target.calculated_stats.physical_defence*(this.target.hasTag('no shield')?0.2:0.7),
      ranged_defence   : this.target.calculated_stats.ranged_defence*(this.target.hasTag('no shield')?0.2:0.7),
      evasion          : this.target.calculated_stats.evasion*0.3,
    }
  }
}
