import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusBattle } from "../../StatusBattle";

//reduce speed, increase accuracy melee if target has prone, reduce accuracy melee if user has prone.
export class StatusProne extends StatusBattle
{
  protected DURATION: number = 4;
  get description(): string {
      return 'Is prone'
  }
  applyModifiers(character: Character): void {
      character.calculated_stats.initiative *= 0.8;
      character.calculated_stats.physical_defence *= 0.8;
  }
  get name(): statusname { return 'Prone'; }
  get tags(): tag[] { return super.tags.concat(['prone']); }
}
