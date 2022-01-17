import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { register_item_function } from "src/gameLogic/custom/Factory/ItemFactory";
import { status_factory } from "src/gameLogic/custom/Factory/StatusFactory";
const register: register_item_function = (ItemSwitcher, {GameItem}, Factory) => {
  const StatusFactory = Factory as status_factory;
  class PoisonPill extends GameItem {
    get name(): itemname { return 'Poison Pill' }
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
  ItemSwitcher['Poison Pill'] = PoisonPill
}

const module_name = 'Poison Pill'
const module_dependency = ['Poison']
module.exports = { register, module_name, module_dependency};
