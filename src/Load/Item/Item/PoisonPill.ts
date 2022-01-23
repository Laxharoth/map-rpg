import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { StatusFactoryFuctioin } from "src/gameLogic/custom/Factory/StatusFactory";


const register: register_function = ({game_item}, {game_item:{GameItem}}, Factory) => {
  const StatusFactory = Factory as StatusFactoryFuctioin;
  class PoisonPill extends GameItem {
    readonly type:"PoisonPill"="PoisonPill"
    get name(): string { return 'Poison Pill' }
    get isMapUsable(): boolean { return false; }
    get isPartyUsable(): boolean { return false; }
    protected _itemEffect(user: Character, target: Character): ActionOutput
    {
      const poison = StatusFactory(this.masterService, { Factory:"Status" ,type: "Poison" })
      //@ts-ignore
      poison.DURATION = 1;
      return target.addStatus(poison);
    }
  }
  game_item['PoisonPill'] = PoisonPill
}

const module_name = 'PoisonPill'
const module_dependency = ['Poison']
export { register, module_name, module_dependency};
