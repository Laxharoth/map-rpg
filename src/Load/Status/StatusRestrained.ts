import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status,special_attack},{status:{Status,StatusBattle},special_attack:{SpecialAttack}},Factory)=>{
class StatusRestrained extends StatusBattle
{
  protected DURATION: number = 4;

  get description(): string {
      return 'Being grabbed by something impedes movements.'
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is being like tied or something`]]; }
  applyModifiers(character: Character): void {
      character.calculated_stats.initiative = 0;
  }
  readonly type: "Restrained"="Restrained"
  get name(): string { return 'Restrained'; }
  onStatusRemoved(target: Character): ActionOutput
  { return Factory.pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}

  get tags(): tag[] { return super.tags.concat(['prone','restrained'])}
}
status["Restrained"] = StatusRestrained
}
const module_name = "Restrained"
const module_dependency = []
export { register, module_name, module_dependency}
