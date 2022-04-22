import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { StatusFactoryFuctioin } from "src/gameLogic/custom/Factory/StatusFactory";


const register: registerFunction = ({gameItem}, {gameItem:{GameItem}}, Factory) => {
  const StatusFactory = Factory as StatusFactoryFuctioin;
  class PoisonPill extends GameItem {
    readonly type:"PoisonPill"="PoisonPill"
    get name(): string { return 'Poison Pill' }
    get isMapUsable(): boolean { return false; }
    get isPartyUsable(): boolean { return false; }
    protected _itemEffect(user: Character, target: Character): ActionOutput
    {
      const poison = StatusFactory(this.masterService, { Factory:"Status" ,type: "Poison" })
      // @ts-ignore
      poison.DURATION = 1;
      return target.addStatus(poison);
    }
  }
  // tslint:disable-next-line: no-string-literal
  gameItem['PoisonPill'] = PoisonPill
}

const moduleName = 'PoisonPill'
const moduleDependency:string[] = ['Poison']
export { register, moduleName, moduleDependency};
