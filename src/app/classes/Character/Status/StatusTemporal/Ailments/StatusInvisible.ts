import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

export class StatusInvisible extends StatusBattle
{
  protected DURATION: number = 4;
  get description(): string {
      return 'Hides in plain sight';
  }
  protected effect(target: Character): ActionOutput {
      target.roundStats.evasion *= 1.2;
      return [[],[]];
  }
  get name(): statusname { return 'Invisible'; }
  get tags(): tag[] { return super.tags.concat(['aim','invisible']);}
}
