import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { damageTypes } from "src/gameLogic/custom/Class/Battle/DamageSource";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { rangedname } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{RangedWeapon}},Factory)=>{
  class RangedTest extends RangedWeapon
  {
    protected _damageTypes:damageTypes = {piercedamage:20,energydamage:10}
    get name(): rangedname { return 'Ranged Test'; }
    canEquip(character: Character): boolean { return true; }
  }
  game_item["Ranged Test"]=RangedTest
}
const module_name = "RangedTest"
const module_dependency = []
export { register, module_name, module_dependency }
