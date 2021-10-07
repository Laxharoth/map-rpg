import { itemname } from 'src/app/customTypes/itemnames';
import { storeable } from 'src/app/customTypes/customTypes';
import { MasterService } from "src/app/service/master.service";
import { ItemFactory } from '../Character/Factory/ItemFactory';
import { Shop } from "./Shop";

export class DynamicShop extends Shop implements storeable{

  private shopPrices:{[key:string]:number};
  constructor(name:string,masterService: MasterService,shopPrices:{[key:string]:number}={})
  {
    //itemas are added from json
    super(name,[],masterService,{})
    this.shopPrices = shopPrices
  }
  // TODO save the shop inventary
  toJson(): {[key: string]:{options:{amount:number}} } {
    const shopSavedata:{[key: string]:{options:{amount:number}} } = {}
    for(const item of this.shopItems)
    {
      if(item.name in shopSavedata){ shopSavedata[item.name].options.amount += item.amount;continue;}
      shopSavedata[item.name] = {options:item.toJson()};
    }
    return shopSavedata
  }
  //TODO load the shop inventary
  fromJson(options: {[key: string]:{options:{amount:number}} }): void {
    for(const [key,{options:itemOptions}] of Object.entries(options))
    {
      const item = ItemFactory(this.masterService,key as itemname,itemOptions);
      if(key in this.shopPrices) { item.basePrice = this.shopPrices[key] }
      this.addItem(item);
    }
  }

}
