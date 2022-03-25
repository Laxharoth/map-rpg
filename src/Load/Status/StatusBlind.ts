import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusBlind extends StatusBattle
  {
    protected DURATION: number = 4;
    private target!:Character;
    get name(): string { return 'Blind' }
    readonly type:'Blind'='Blind'
    get description(): string {
        return 'Reduces accuracy and evasion';
    }
    onStatusGainded(target: Character): ActionOutput{
      this.target = target;
      return super.onStatusGainded(target);
    }
    // @ts-ignore
    protected get _stats_modifier():CalculatedStats{
      return { accuracy: this.target.calculated_stats.accuracy * 0.2  };
    };
    get tags(): tag[] { return super.tags.concat(['blind'])}
  }
  status["Blind"] = StatusBlind;
}
const module_name = "Blind"
const module_dependency:string[] = []

export {register,module_name,module_dependency}
