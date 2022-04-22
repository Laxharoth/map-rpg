import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusBlind extends StatusBattle{
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
      return { accuracy: this.target.calculatedStats.accuracy * 0.2  };
    };
    get tags(): tag[] { return super.tags.concat(['blind'])}
  }
  // tslint:disable-next-line: no-string-literal
  status["Blind"] = StatusBlind;
}
const moduleName = "Blind"
const moduleDependency:string[] = []

export {register,moduleName,moduleDependency}
