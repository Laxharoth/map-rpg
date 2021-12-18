import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusDefend extends StatusBattle
{
  protected DURATION: number = 1;
  get name(): statusname { return 'Defend'; }
  get description(): string { return 'Increases defence and evasion.'; }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} raises it's defence.`]]; }
  applyModifiers(character: Character): void {
    character.calculated_stats.physical_defence*=(character.hasTag('no shield'))?1.2:1.7;
    character.calculated_stats.ranged_defence*=(character.hasTag('no shield'))?1.2:1.7;
    character.calculated_stats.evasion*=1.3;
  }
  onStatusGainded(target: Character):ActionOutput
  { return pushBattleActionOutput(super.onStatusGainded(target),this.effect(target)); }
  get tags(): tag[] { return super.tags.concat(['defend']) }
}
