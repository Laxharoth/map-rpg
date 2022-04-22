import { registerFunction } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status,specialAttack}
  ,{status:{Status,StatusBattle},specialAttack:{SpecialAttack}},Factory)=>{
class StatusSleep extends StatusBattle {
  private target!:Character;
  protected DURATION: number = 4;
  readonly type:"Sleep"="Sleep"
  get name(): string { return 'Sleep'; }
  get description(): string {
    return "The target can't move.";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is sleeping.`]] }
  onStatusGainded(target: Character): ActionOutput {
    this.target = target;
    return super.onStatusGainded(target)
  }
  // @ts-ignore
  protected get _stats_modifier():CalculatedStats {
    return { evasion: this.target.calculatedStats.evasion * (-0.2)};
  }
  onStatusRemoved(target: Character): ActionOutput{
    return Factory
      .pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]);
    }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.calculatedResistance.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized','sleep'])}
}
// tslint:disable-next-line: no-string-literal
status["Sleep"]=StatusSleep
}
const moduleName="Sleep"
const moduleDependency:string[]= []
export { register, moduleName, moduleDependency}
