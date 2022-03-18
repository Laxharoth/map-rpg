import { register_function } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusProne extends StatusBattle
  {
    protected DURATION: number = 4;
    get description(): string { return 'Is prone' }
    applyModifiers(character: Character): void {
        character.calculated_stats.initiative *= 0.8;
        character.calculated_stats.physical_defence *= 0.8;
    }
    readonly type: "Prone"="Prone"
    get name(): string { return 'Prone'; }
    get tags(): tag[] { return super.tags.concat(['prone']); }
}
status["Prone"]=StatusProne
}
const module_name = "Prone"
const module_dependency:string[] = []
export { register, module_name, module_dependency}
