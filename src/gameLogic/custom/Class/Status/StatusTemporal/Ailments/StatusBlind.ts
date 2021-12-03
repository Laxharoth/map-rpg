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
  protected effect(target: Character): ActionOutput {
      target.roundStats.evasion=Math.round(0.8*target.roundStats.evasion);
      return [[],[]];
  }
  get tags(): tag[] { return super.tags.concat(['blind'])}
}
