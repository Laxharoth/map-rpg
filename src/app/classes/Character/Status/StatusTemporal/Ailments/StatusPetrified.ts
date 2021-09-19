import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";
import { StatusPoison } from "../StatusPoison";

export class StatusPetrified extends StatusBattle
{
  protected DURATION: number = 4;
  private previousPoison:number;
  get description(): string {
      throw new Error("Method not implemented.");
  }
  protected effect(target: Character): ActionOutput {
      target.roundStats.defence*=1.2;
      const poison = this.getPoison(target);
      if(poison)poison.extraDuration = 1;
      return [[],[]];
  }
  get name(): statusname { return 'Petrified'; }
  onStatusGainded(target: Character): ActionOutput
  {
      this.previousPoison = target.stats.poisonresistance;
      target.stats.poisonresistance = 100;
      if(target.stats?.poisonresistance)target.stats.poisonresistance=100;
      return super.onStatusGainded(target);
  }
  onStatusRemoved(target: Character): ActionOutput
  {
      target.stats.poisonresistance = this.previousPoison;
      return super.onStatusRemoved(target);
  }
  private getPoison(target: Character):StatusPoison
  {
    return target.getStatus('Poison') as StatusPoison;
  }
  get tags(): tag[] { return super.tags.concat(['paralized','petrified'])}
}
