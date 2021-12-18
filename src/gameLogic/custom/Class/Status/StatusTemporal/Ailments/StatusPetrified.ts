import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusBattle } from "../../StatusBattle";
import { StatusPoison } from "../StatusPoison";

export class StatusPetrified extends StatusBattle
{
  protected DURATION: number = 4;
  protected _resistance_stats: ResistanceStats = {poisonresistance:100};
  get description(): string {
      throw new Error("Method not implemented.");
  }
  protected effect(target: Character): ActionOutput {
      const poison = this.getPoison(target);
      if(poison)poison.extraDuration = 1;
      return super.effect(target);
  }
  applyModifiers(character: Character): void {
    character.calculated_stats.physical_defence*=1.2;
    character.calculated_stats.ranged_defence*=1.2;
    character.calculated_stats.initiative = 0;
    super.applyModifiers(character);
  }
  get name(): statusname { return 'Petrified'; }
  onStatusGainded(target: Character): ActionOutput { return super.onStatusGainded(target); }
  onStatusRemoved(target: Character): ActionOutput { return super.onStatusRemoved(target); }
  private getPoison(target: Character):StatusPoison { return target.getStatus('Poison') as StatusPoison; }
  get tags(): tag[] { return super.tags.concat(['paralized','petrified'])}
}
