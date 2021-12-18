import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";

export class StatusBlind extends StatusBattle
{
  protected DURATION: number = 4;
  get name(): statusname { return 'Blind' }
  get description(): string {
      return 'Reduces accuracy and evasion';
  }
  applyModifiers(character: Character): void {
    character.calculated_stats.accuracy=Math.round(0.8*character.calculated_stats.accuracy);
  }
  get tags(): tag[] { return super.tags.concat(['blind'])}
}
