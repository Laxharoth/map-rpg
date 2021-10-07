import { CHARACTERSELLITEMPRICEREDUCTION } from 'src/app/customTypes/constants';
import { removeItem } from 'src/app/htmlHelper/htmlHelper.functions';
import { Item } from '../Items/Item';
export class Sale
{
  items2Character:Item[]=[];
  items2Shop:Item[]=[];
  get total(){return this.__total();}
  constructor(){}

  addItem2Character(item:Item){
    for(const shopItem of this.items2Character)
      if(this.didAddItemAmounts(shopItem, item))return;
    this.items2Character.push(item)
  }

  addItem2Shop(item:Item) {
    for(const shopItem of this.items2Shop)
      if(this.didAddItemAmounts(shopItem, item))return;
    this.items2Shop.push(item)
  }
  removeItem2Character(shopItem:Item,amount:number):void {
    shopItem.amount-=amount;
    (shopItem.amount<=0) && removeItem(this.items2Character, shopItem)
  }
  removeItem2Shop(shopItem:Item,amount:number):void {
    shopItem.amount-=amount;
    (shopItem.amount<=0) && removeItem(this.items2Shop, shopItem);
  }
  get saleActionHasBeenMade():boolean
  {
    return Boolean(this.items2Character.length || this.items2Shop.length);
  }

  private __total():number
  {
    return this.items2Character.reduce((acc, saleItem) => acc + saleItem.basePrice * saleItem.amount,0)
            - this.items2Shop.reduce(  (acc, saleItem) => acc + saleItem.basePrice / CHARACTERSELLITEMPRICEREDUCTION * saleItem.amount,0);
  }
  private didAddItemAmounts(shopItem: Item, item: Item):boolean {
    if(shopItem.constructor !== item.constructor) return false
    shopItem.amount += item.amount;
    return true
  }
}
