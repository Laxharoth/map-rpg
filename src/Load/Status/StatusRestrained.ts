import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status,specialAttack},{status:{Status,StatusBattle},specialAttack:{SpecialAttack}},Factory)=>{
class StatusRestrained extends StatusBattle{
  private target!:Character;
  protected DURATION: number = 4;
  get description(): string {
      return 'Being grabbed by something impedes movements.'
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is being like tied or something`]]; }
  onStatusGainded(target: Character): ActionOutput {
    this.target = target;
    return super.onStatusGainded(target);
  }
  readonly type: "Restrained"="Restrained"
  get name(): string { return 'Restrained'; }
  onStatusRemoved(target: Character): ActionOutput
  { return Factory.pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}
  // @ts-ignore
  protected get _stats_modifier():CalculatedStats{
    return { initiative: this.target.calculatedStats.initiative };
  }
  get tags(): tag[] { return super.tags.concat(['prone','restrained'])}
}
status["Restrained"] = StatusRestrained
}
const module_name = "Restrained"
const module_dependency:string[] = []
export { register, module_name, module_dependency}
