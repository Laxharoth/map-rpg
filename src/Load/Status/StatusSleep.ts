import { register_function } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status,special_attack},{status:{Status,StatusBattle},special_attack:{SpecialAttack}},Factory)=>{
class StatusSleep extends StatusBattle {
  protected DURATION: number = 4;
  readonly type:"Sleep"="Sleep"
  get name(): string { return 'Sleep'; }
  get description(): string {
    return "The target can't move.";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is sleeping.`]] }
  applyModifiers(character: Character): void { character.calculated_stats.evasion*=0.8; }
  onStatusRemoved(target: Character): ActionOutput
  { return Factory.pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.calculated_resistance.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized','sleep'])}
}
status["Sleep"]=StatusSleep
}
const module_name="Sleep"
const module_dependency:string[]= []
export { register, module_name, module_dependency}
