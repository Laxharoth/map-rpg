import { itemname } from 'src/app/customTypes/itemnames';
import { storeable } from 'src/app/customTypes/customTypes';
import { MasterService } from "src/app/service/master.service";
import { ItemFactory } from '../Character/Factory/ItemFactory';
import { Shop } from "./Shop";
import { Item } from '../Items/Item';

export class DynamicShop extends Shop implements storeable{

  private shopPrices:{[key:string]:number};
  constructor(name:string,description:()=>string,masterService: MasterService,shopPrices:{[key:string]:number}={})
  {
    //itemas are added from json
    super(name,[],description,masterService,{})
    this.shopPrices = shopPrices
  }
  addItem(item:Item):void
  {
    super.addItem(item);
    if(this.shopPrices?.[item.name])
    { item.basePrice = this.shopPrices[item.name]; }
  }
  toJson(): {[key: string]:{options:{amount:number}} } {
    const shopSavedata:{[key: string]:{options:{amount:number}} } = {}
    for(const item of this.shopItems)
    {
      if(item.name in shopSavedata){ shopSavedata[item.name].options.amount += item.amount;continue;}
      shopSavedata[item.name] = {options:item.toJson()};
    }
    return shopSavedata
  }
  fromJson(options: {[key: string]:{options:{amount:number}} }): void {
    for(const [key,{options:itemOptions}] of Object.entries(options))
    {
      const item = ItemFactory(this.masterService,key as itemname,itemOptions);
      if(key in this.shopPrices) { item.basePrice = this.shopPrices[key] }
      this.addItem(item);
    }
  }

}
