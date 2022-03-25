import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusFactoryFuctioin } from "src/gameLogic/custom/Factory/StatusFactory";

const register:register_function = ({game_item}, {game_item:{GameItem}}, Factory)=>{
  const statusFactory = Factory as StatusFactoryFuctioin;
  class FakeDragonEgg extends GameItem{
    type: itemname="FakeDragonEgg";
    get isBattleUsable(): boolean { return true; }
    get isSelfUsable(): boolean { return true; }
    get isPartyUsable(): boolean { return true; }
    get isEnemyUsable(): boolean { return true; }
    get isSingleTarget(): boolean { return false; }
    get isMapUsable(): boolean { return false; }
    get name(): string {
      return "FakeDragonEgg"
    }
    protected _itemEffect(user: Character, target: Character): ActionOutput {
      return target.addStatus(
        statusFactory( this.masterService, { Factory:"Status", type:"Blind" } )
      );
    }
    get tags():tag[]{return ["fake egg","Blind","status gained"];}
  }
  class Net extends GameItem{
    type: itemname="Net";
    get isBattleUsable(): boolean { return true; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSingleTarget(): boolean { return true; }
    get isMapUsable(): boolean { return false; }
    get name(): string {
      return "Net"
    }
    protected _itemEffect(user: Character, target: Character): ActionOutput {
      return target.addStatus(
        statusFactory( this.masterService, { Factory:"Status", type:"Restrained" } )
      );
    }
    get tags():tag[]{return ["net","Restrained","status gained"];}
  }
  game_item["FakeDragonEgg"] = FakeDragonEgg;
}
const module_name = "small-campaign-items";
const module_dependency:string[] = ["small-campaign-status"];
export { register, module_name, module_dependency };
