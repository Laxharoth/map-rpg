import { registerFunction } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status},{status:{StatusBattle}},Factory)=>{
  class StatusInvisible extends StatusBattle{
    private target!:Character;
    protected DURATION: number = 4;
    get description(): string { return 'Hides in plain sight'; }
    onStatusGainded(target: Character): ActionOutput{
      this.target= target;
      return super.onStatusGainded(target);
    }
    // @ts-ignore
    protected get _stats_modifier():CalculatedStats{
      return { evasion: this.target.calculatedStats.evasion * 0.2 };
    };
    readonly type: "Invisible"="Invisible";
    get name(): string { return 'Invisible'; }
    get tags(): tag[] { return super.tags.concat(['aim','invisible']);}
  }
  // tslint:disable-next-line: no-string-literal
  status["Invisible"]=StatusInvisible
}
const moduleName="Invisible"
const moduleDependency:string[]=[]
export { register, moduleName, moduleDependency }
