import { register_function } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusProne extends StatusBattle{
    private target!:Character;
    readonly type: "Prone"="Prone"
    get name(): string { return 'Prone'; }
    get tags(): tag[] { return super.tags.concat(['prone']); }
    protected DURATION: number = 4;
    get description(): string { return 'Is prone' }
    onStatusGainded(target: Character): ActionOutput {
      this.target = target;
      return super.onStatusGainded(target);
    }
    // @ts-ignore
    protected get _stats_modifier():CalculatedStats{
      return {
        initiative:this.target.calculated_stats.initiative * (-0.2),
        physical_defence:this.target.calculated_stats.physical_defence * (-0.2),
      };
    }
}
status["Prone"]=StatusProne
}
const module_name = "Prone"
const module_dependency:string[] = []
export { register, module_name, module_dependency}
