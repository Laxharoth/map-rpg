import { MasterService } from "src/app/service/master.service";
import { FactoryFunction, factoryname } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameItem, ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { itemname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { Shop } from "src/gameLogic/custom/Class/Shop/Shop";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';

export class DynamicShop extends Shop implements storeable{

  private shopPrices:{[key:string]:number};
  constructor(name:string,description:()=>string,masterService: MasterService,shopPrices:{[key:string]:number}={})
  {
    //itemas are added from json
    super(name,[],description,masterService,{})
    this.shopPrices = shopPrices
  }
  addItem(item:GameItem):void
  {
    super.addItem(item);
    if(this.shopPrices?.[item.name])
    { item.basePrice = this.shopPrices[item.name]; }
  }
  toJson(): ShopStoreable{
    const shopSavedata:ShopStoreable = {Factory:"Shop", type:this.name,Items:[]}
    const findItem =  (itemname:itemname)=>shopSavedata.Items[shopSavedata.Items.findIndex((item:ItemStoreable)=>item.type === itemname )]
    for(const item of this.shopItems)
    {
      const itemoptions = findItem(item.name)
      if(itemoptions){ itemoptions.amount += item.amount;continue;}
      shopSavedata.Items.push(item.toJson())
    }
    return shopSavedata
  }
  fromJson(options:ShopStoreable): void {
    for(const itemoptions of options.Items)
    {
      const item = ItemFactory(this.masterService,itemoptions);
      if(itemoptions.type in this.shopPrices) { item.basePrice = this.shopPrices[itemoptions.type] }
      this.addItem(item);
    }
  }
}
export type ShopStoreable = {Factory:factoryname;type:string,Items:ItemStoreable[] }
export const ShopFactory:FactoryFunction = (masterService:MasterService,options:ShopStoreable)=>{
    const Shop = new DynamicShop('',()=>'',masterService,{});
    Shop.fromJson(options)
  }
