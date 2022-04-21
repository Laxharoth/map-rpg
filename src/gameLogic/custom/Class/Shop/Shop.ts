import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { fillItemStoreable, GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Sale } from 'src/gameLogic/custom/Class/Shop/Sale';
import { ItemFactory } from "src/gameLogic/custom/Factory/ItemFactory";

//TODO Shop must be generic, only changes Items and maybe price.
export class Shop
{
  private _name: string;
  private calculatedPlayerOverflow = false;
  private currectPlayerOverflow = false;
  protected masterService:MasterService;
  get name():string { return this._name; }
  description:()=>string;
  shopItems:GameItem[]=[];
  sale = new Sale();

  constructor(name:string,shopItemNames:itemname[],description:()=>string,masterService:MasterService,shopPrices:{[key:string]:number}={}){
    this._name = name;
    this.description=description;
    this.masterService= masterService;
    for(const itemname of shopItemNames){
      if(this.shopItems.some(item=>item.name==itemname))continue;
      const item = ItemFactory(this.masterService,fillItemStoreable({type:itemname,basePrice:shopPrices?.itemname}));
      this.shopItems.push(item);
    }
  }
  shopSellItem(item:GameItem,amount:number){
    const shopItem:GameItem = Object.create(item);
    shopItem.amount = amount;
    this.calculatedPlayerOverflow = false;
    this.sale.addItem2Character(shopItem)
  }
  shopBuyItem(item:GameItem,amount:number){
    this.calculatedPlayerOverflow = false;
    const itemToMove:GameItem = Object.create(item);
    itemToMove.amount = Math.min(amount,item.amount);
    this.sale.addItem2Shop(itemToMove);
  }
  shopRemoveSellItem(item:GameItem,amount:number){
    this.calculatedPlayerOverflow = false;
    this.sale.removeItem2Character(item,amount);
  }
  shopRemoveBuyItem(item:GameItem,amount:number){
    this.calculatedPlayerOverflow = false;
    this.sale.removeItem2Shop(item,amount);
  }

  get shopInventoryAfterSale():GameItem[]{
    const inventory:GameItem[] = [];
    const reduceInventory:{[key:string]:number} = {}
    for(const soldItem of this.sale.items2Character)
    { reduceInventory[soldItem.name] = soldItem.amount; }
    for(const item of this.shopItems){
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
  getCharacterInvetoryAfterSale(character: Character):GameItem[]{
    const inventory:GameItem[] = [];
    const reduceInventory:{[key:string]:number} = {}
    for(const boughtItem of this.sale.items2Shop)
    { reduceInventory[boughtItem.type] = boughtItem.amount; }
    for(const item of character.inventory.items){
      const copy = Object.create(item);
      const amountCanReduceOfItem = reduceInventory[item.type]||0;
      const amountInCopy = copy.amount;
      const amountAfterReduce = Math.max(0,amountCanReduceOfItem-amountInCopy);
      copy.amount -= amountCanReduceOfItem-amountAfterReduce;
      reduceInventory[item.type]=amountAfterReduce;
      inventory.push(copy);
    }
    return inventory;
  }
  addItem(item:GameItem):void{
    if(!item){console.warn("Item not found, Is null or undefined."); return;}
    this.fitItemIntoinventory(item);
    if(item.amount <= 0) return;
    this.shopItems.push(item);
  }
  CheckoutSale(character:Character):void{
    this.CheckoutSaleUpdateCharacterItems(character);
    this.CheckoutSaleUpdateShopInventory();
    //Reset sale items
    this.sale.items2Shop = [];
    this.sale.items2Character =[];
  }
  private CheckoutSaleUpdateCharacterItems(character: Character){
    const copyItemsAmount: { [key: string]: number; } = {};
    for (const item of this.sale.items2Shop) { copyItemsAmount[item.name] = item.amount; }
    for (const characteritem of character.inventory.items){
      if (copyItemsAmount.hasOwnProperty(characteritem.name)){
        const reduceAmount = Math.min(characteritem.amount, copyItemsAmount[characteritem.name]);
        characteritem.amount -= reduceAmount;
        copyItemsAmount[characteritem.name] -= reduceAmount;
        character.inventory.dropItem(characteritem)
        if(characteritem.amount>0)character.inventory.addItem(characteritem);
      }
    }
    for (const item of this.sale.items2Character)
    { character.inventory.addItem(ItemFactory(this.masterService,fillItemStoreable({type:item.type,amount:item.amount}))); }
    character.gold-=this.sale.total;
  }
  private CheckoutSaleUpdateShopInventory() {
    const shopInventoryAfterSale = this.shopInventoryAfterSale;
    this.shopItems = shopInventoryAfterSale;
    for (const item of this.sale.items2Shop)
      this.addItem(item);
  }
  doesCharacterInventoryOverflows(character: Character):boolean{
    if(!this.calculatedPlayerOverflow){
      this.calculatedPlayerOverflow = true;
      this.currectPlayerOverflow =  character.inventory.inventorySize
                                    <
                                    this.mergeCharacterItems(character)
                                      .reduce((acc, item) => acc + Math.ceil(item.amount/item.maxStack),0);
    }
    return this.currectPlayerOverflow;
  }
  private fitItemIntoinventory(item: GameItem):void{
    if(item.amount<=0)return;
    for (const shopItem of this.shopItems)
      if (shopItem.constructor === item.constructor){
        shopItem.amount += item.amount;
        item.amount = 0;
        return;
      }
  }
  private mergeCharacterItems(character: Character):GameItem[]{
    const items:GameItem[] = [];
    const characterInventoryAfterSale = this.sale.items2Character.concat(this.getCharacterInvetoryAfterSale(character));
    for(const characterItem of characterInventoryAfterSale){
      let addItem = true;
      const copy =  Object.create(characterItem);
      for(const item of items){
        if(copy.constructor === item.constructor){
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

export const ErrorShop = function(){
  let errorShop:Shop;
  return function(masterService:MasterService){
    if(!errorShop)errorShop =new Shop('ERROR',[],()=>"NOT SHOP PROVIDED",masterService)
    return errorShop
  }
}()
