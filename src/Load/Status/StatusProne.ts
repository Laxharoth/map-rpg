import { registerFunction } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status},{status:{StatusBattle}},Factory)=>{
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
        initiative:this.target.calculatedStats.initiative * (-0.2),
        physicalDefence:this.target.calculatedStats.physicalDefence * (-0.2),
      };
    }
}
// tslint:disable-next-line: no-string-literal
status["Prone"]=StatusProne
}
const moduleName = "Prone"
const moduleDependency:string[] = []
export { register, moduleName, moduleDependency}
