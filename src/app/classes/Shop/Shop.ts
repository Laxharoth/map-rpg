import { Item } from 'src/app/classes/Items/Item';
import { ItemFactory } from '../Character/Factory/ItemFactory';
import { MasterService } from "src/app/service/master.service";
import { itemname } from './../../customTypes/itemnames';
import { Character } from '../Character/Character';
import { Sale } from './Sale';

//TODO Shop must be generic, only changes Items and maybe price.
export class Shop
{
  private _name: string;
  private calculatedPlayerOverflow = false;
  private currectPlayerOverflow = false;
  protected masterService:MasterService;
  get name():string { return this._name; }
  description:()=>string;
  shopItems:Item[]=[];
  sale = new Sale();

  constructor(name:string,shopItemNames:itemname[],description:()=>string,masterService:MasterService,shopPrices:{[key:string]:number}={})
  {
    this._name = name;
    this.description=description;
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
    this.calculatedPlayerOverflow = false;
    this.sale.addItem2Character(shopItem)
  }
  shopBuyItem(item:Item,amount:number){
    this.calculatedPlayerOverflow = false;
    const itemToMove:Item = Object.create(item);
    itemToMove.amount = Math.min(amount,item.amount);
    this.sale.addItem2Shop(itemToMove);
  }
  shopRemoveSellItem(item:Item,amount:number){
    this.calculatedPlayerOverflow = false;
    this.sale.removeItem2Character(item,amount);
  }
  shopRemoveBuyItem(item:Item,amount:number){
    this.calculatedPlayerOverflow = false;
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
    for(const item of character.inventory)
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
  addItem(item:Item):void
  {
    if(!item){console.warn("Item not found, Is null or undefined."); return;}
    this.fitItemIntoinventory(item);
    if(item.amount <= 0) return;
    this.shopItems.push(item);
  }
  CheckoutSale(character:Character):void
  {
    this.CheckoutSaleUpdateCharacterItems(character);
    this.CheckoutSaleUpdateShopInventory();
    //Reset sale items
    this.sale.items2Shop = [];
    this.sale.items2Character =[];
  }
  private CheckoutSaleUpdateCharacterItems(character: Character)
  {
    const copyItemsAmount: { [key: string]: number; } = {};
    for (const item of this.sale.items2Shop) { copyItemsAmount[item.name] = item.amount; }
    for (const characteritem of character.inventory)
    {
      if (copyItemsAmount.hasOwnProperty(characteritem.name))
      {
        const reduceAmount = Math.min(characteritem.amount, copyItemsAmount[characteritem.name]);
        characteritem.amount -= reduceAmount;
        copyItemsAmount[characteritem.name] -= reduceAmount;
      }
    }
    for (const item of this.sale.items2Character)
    { character.addItem(ItemFactory(this.masterService,item.name,{amount:item.amount})); }
    character.gold-=this.sale.total;
  }
  private CheckoutSaleUpdateShopInventory() {
    const shopInventoryAfterSale = this.shopInventoryAfterSale;
    this.shopItems = shopInventoryAfterSale;
    for (const item of this.sale.items2Shop)
      this.addItem(item);
  }

  doesCharacterInventoryOverflows(character: Character):boolean
  {
    if(!this.calculatedPlayerOverflow)
    {
      this.calculatedPlayerOverflow = true;
      this.currectPlayerOverflow =  character.inventorysize
                                    <
                                    this.mergeCharacterItems(character)
                                      .reduce((acc, item) => acc + Math.ceil(item.amount/item.maxStack),0);
    }
    return this.currectPlayerOverflow;
  }
  private fitItemIntoinventory(item: Item):void
  {
    if(item.amount<=0)return;
    for (const shopItem of this.shopItems)
      if (shopItem.constructor === item.constructor)
      {
        shopItem.amount += item.amount;
        item.amount = 0;
        return;
      }
  }
  private mergeCharacterItems(character: Character):Item[]
  {
    const items:Item[] = [];
    const characterInventoryAfterSale = this.sale.items2Character.concat(this.getCharacterInvetoryAfterSale(character));

    for(const characterItem of characterInventoryAfterSale)
    {
      let addItem = true;
      const copy =  Object.create(characterItem);
      for(const item of items)
      {
        if(copy.constructor === item.constructor)
        {
          item.amount += copy.amount;
          addItem = false;
          break;
        }
      }
      if(addItem)items.push(copy);
    }

    return items;
  }
}

export const ErrorShop = function()
{
  let errorShop = null;
  return function(masterService:MasterService){
    if(!errorShop)errorShop =new Shop('ERROR',[],()=>"NOT SHOP PROVIDED",masterService)
    return errorShop
  }
}()
