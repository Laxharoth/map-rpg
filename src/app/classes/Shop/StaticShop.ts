import { MasterService } from "src/app/service/master.service";
import { itemname } from './../../customTypes/itemnames';
import { Shop } from './Shop';
export class StaticShop extends Shop
{
  constructor(name:string,shopItemNames:itemname[],description:()=>string,masterService: MasterService,shopPrices:{ [key: string]: number;})
  {
    super(name,shopItemNames,description,masterService,shopPrices)
    for(const item of this.shopItems) item.amount = Infinity;
  }
}
