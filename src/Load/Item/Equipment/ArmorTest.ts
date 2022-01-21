import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { armorname } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{Armor} },Factory)=>{
  class ArmorTest extends Armor
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20,initiative:-5};
    protected _resistance_stats:ResistanceStats = {pierceresistance:10}
    get name(): armorname { return "Armor Test"; }
    canEquip(): boolean { return true; }
  }
  game_item["Armor Test"] = ArmorTest
}
const module_name="ArmorTest";
const module_dependency=[]

export {register, module_name, module_dependency}
