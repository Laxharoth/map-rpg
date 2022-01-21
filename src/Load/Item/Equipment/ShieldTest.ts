import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { shieldname } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{Shield}},Factory)=>{
  class ShieldTest extends Shield
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20};
    protected _resistance_stats:ResistanceStats = {bluntresistance:10,pierceresistance:5}
    get name(): shieldname { return 'Shield test'; }
    canEquip(character: Character): boolean { return true; }
  }
  game_item["Shield test"]=ShieldTest
}
const module_name = "ShieldTest"
const module_dependency = []
export { register, module_name, module_dependency}
