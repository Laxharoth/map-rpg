import { register_function } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from 'src/gameLogic/custom/Class/Status/StatusBattle';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusPetrified extends StatusBattle
  {
    protected DURATION: number = 4;
    protected _resistance_stats: ResistanceStats = {poisonresistance:100};
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
    readonly type: "Petrified"="Petrified";
    get name(): string { return 'Petrified'; }
    onStatusGainded(target: Character): ActionOutput { return super.onStatusGainded(target); }
    onStatusRemoved(target: Character): ActionOutput { return super.onStatusRemoved(target); }
    private getPoison(target: Character):StatusBattle { return target.getStatus('Poison') as StatusBattle; }
    get tags(): tag[] { return super.tags.concat(['paralized','petrified'])}
    get description(): string { return "super.description"}
  }
  status["Petrified"]=StatusPetrified
}
const module_name = "Petrified"
const module_dependency = []
export { register, module_name, module_dependency}
