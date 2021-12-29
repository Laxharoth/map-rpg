import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { Character } from "../../Character/Character";
import { statusname } from "../Status.type";
import { StatusBattle } from "../StatusBattle";

export class PoisonRush extends StatusBattle
{
  get name(): statusname { return "Poison Rush"; }
  get description(): string { return 'increase physicall attack after poison status is lost' }
  protected DURATION: number = 1;
  applyModifiers(character: Character): void {
    character.calculated_stats.physical_attack*=4;
  }
  onStatusGainded(target: Character): ActionOutput
  {
    return pushBattleActionOutput([[],['Overcoming poison grants extra attack']],super.onStatusGainded(target))
  }
}
