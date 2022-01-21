import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusBlind extends StatusBattle
  {
    protected DURATION: number = 4;
    get name(): statusname { return 'Blind' }
    get description(): string {
        return 'Reduces accuracy and evasion';
    }
    applyModifiers(character: Character): void {
      character.calculated_stats.accuracy=Math.round(0.8*character.calculated_stats.accuracy);
    }
    get tags(): tag[] { return super.tags.concat(['blind'])}
  }
  status["Blind"] = StatusBlind;
}
const module_name = "Blind"
const module_dependency = []

export {register,module_name,module_dependency}
