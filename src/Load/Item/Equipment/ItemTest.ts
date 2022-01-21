import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{GameItem}}, Factory)=>{
  class ItemTest extends GameItem
  {
    get name(): itemname { return 'item-test'; }
    get isBattleUsable(): boolean { return false; }
    get isPartyUsable(): boolean { return true; }
    get isEnemyUsable(): boolean { return false; }
    get isSelfUsable(): boolean { return true; }
    get isSingleTarget(): boolean { return false; }
    protected _itemEffect(user:Character,target: Character): ActionOutput
    {
    const healHitPoints = target.healHitPoints(10);
    return [[this.itemEffectDescription(target, healHitPoints)],[]];
    }

    //Description
    private itemEffectDescription(target:Character, healHitPoints:number)
    {
      return new Factory.Description(function(){return `Heal ${target.name} ${healHitPoints}`},[Factory.options.nextOption(this.masterService)])
    }
  }
  game_item["item-test"]=ItemTest
}
const module_name = "ItemTest"
const module_dependency = []
export { register, module_name, module_dependency}
