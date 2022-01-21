import { register_function } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusInvisible extends StatusBattle
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
  status["Invisible"]=StatusInvisible
}
const module_name="Invisible"
const module_dependency=[]
export { register, module_name, module_dependency }
