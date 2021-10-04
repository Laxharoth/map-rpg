import { Item } from 'src/app/classes/Items/Item';
import { ItemFactory } from '../Character/Factory/ItemFactory';
import { MasterService } from "src/app/service/master.service";
import { itemname } from './../../customTypes/itemnames';
import { Character } from '../Character/Character';
import { Sale } from './Sale';

//TODO Shop must be generic, only changes Items and maybe price.
//TODO Check if inventary is full or not.
//TODO function to finish the sale
export class Shop
{
  private _name: string;
  private masterService:MasterService;
  get name():string { return this._name; }
  shopItems:Item[]=[];
  sale = new Sale();

  constructor(name:string,shopItemNames:itemname[],masterService:MasterService,shopPrices:{[key:string]:number}={})
  {
    this._name = name;
    this.masterService= masterService;
    for(const itemname of shopItemNames)
    {
      if(this.shopItems.some(item=>item.name==itemname))continue;
      const item = ItemFactory(this.masterService,itemname,{basePrice:shopPrices?.[itemname]});
      this.shopItems.push(item);
    }
  }
  shopSellItem(item:Item,amount:number){
    const shopItem:Item = Object.create(item);
    shopItem.amount = amount;
    this.sale.addItem2Character(shopItem)
  }
  shopBuyItem(item:Item,amount:number){
    const itemToMove:Item = Object.create(item);
    itemToMove.amount = Math.min(amount,item.amount);
    this.sale.addItem2Shop(itemToMove);
  }
  shopRemoveSellItem(item:Item,amount:number){
    this.sale.removeItem2Character(item,amount);
  }
  shopRemoveBuyItem(item:Item,amount:number){
    this.sale.removeItem2Shop(item,amount);
  }

  get shopInventoryAfterSale():Item[]
  {
    const inventory:Item[] = [];
    const reduceInventory = {}
    for(const soldItem of this.sale.items2Character)
    { reduceInventory[soldItem.name] = soldItem.amount; }
    for(const item of this.shopItems)
    {
      const copy = Object.create(item);
      const amountCanReduceOfItem = reduceInventory[item.name]||0;
      const amountInCopy = copy.amount;
      const amountAfterReduce = Math.max(0,amountCanReduceOfItem-amountInCopy);
      copy.amount -= amountCanReduceOfItem-amountAfterReduce;
      reduceInventory[item.name]=amountAfterReduce;
      inventory.push(copy);
    }
    return inventory;
  }
  getCharacterInvetoryAfterSale(character: Character):Item[]
  {
    const inventory:Item[] = [];
    const reduceInventory = {}
    for(const boughtItem of this.sale.items2Shop)
    { reduceInventory[boughtItem.name] = boughtItem.amount; }
    for(const item of character.inventary)
    {
      const copy = Object.create(item);
      const amountCanReduceOfItem = reduceInventory[item.name]||0;
      const amountInCopy = copy.amount;
      const amountAfterReduce = Math.max(0,amountCanReduceOfItem-amountInCopy);
      copy.amount -= amountCanReduceOfItem-amountAfterReduce;
      reduceInventory[item.name]=amountAfterReduce;
      inventory.push(copy);
    }
    return inventory;
  }
}
