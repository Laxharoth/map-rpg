import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusBattle } from "../../StatusBattle";

export class StatusInvisible extends StatusBattle
{
  protected DURATION: number = 4;
  get description(): string {
      return 'Hides in plain sight';
  }
  applyModifiers(character: Character): void {
    character.calculated_stats.evasion *= 1.2;
  }
  get name(): statusname { return 'Invisible'; }
  get tags(): tag[] { return super.tags.concat(['aim','invisible']);}
}
