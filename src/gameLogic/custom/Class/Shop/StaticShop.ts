import { MasterService } from "src/app/service/master.service";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Shop } from 'src/gameLogic/custom/Class/Shop/Shop';

export class StaticShop extends Shop{
  constructor(name:string,
      shopItemNames:itemname[],
      description:()=>string,
      masterService: MasterService,
      shopPrices:{ [key: string]: number;}){
    super(name,shopItemNames,description,masterService,shopPrices)
    for(const item of this.shopItems) item.amount = Infinity;
  }
}
