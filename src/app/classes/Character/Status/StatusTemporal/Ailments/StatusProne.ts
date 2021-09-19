import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

//reduce speed, increase accuracy melee if target has prone, reduce accuracy melee if user has prone.
export class StatusProne extends StatusBattle
{
  protected DURATION: number = 4;
  get description(): string {
      return 'Is prone'
  }
  protected effect(target: Character): ActionOutput {
      target.roundStats.speed *= 0.8;
      return [[],[]]
  }
  get name(): statusname { return 'Prone'; }
  get tags(): tag[] { return super.tags.concat(['prone']); }
}
