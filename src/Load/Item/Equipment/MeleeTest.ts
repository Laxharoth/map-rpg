import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { damageTypes } from "src/gameLogic/custom/Class/Battle/DamageSource";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { meleename } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{MeleeWeapon}}, Factory)=>{
  class MeleeTest extends MeleeWeapon
  {
    protected _stats_modifier:CalculatedStats = {physical_attack:20}
    protected _damageTypes:damageTypes = {bluntdamage:30};
    get name(): meleename { return 'Melee test'; }
    canEquip(character: Character): boolean { return true; }
  }
  game_item["Melee test"]=MeleeTest
}
const module_name = "MeleeTest"
const module_dependency = []
export { register, module_name, module_dependency}
