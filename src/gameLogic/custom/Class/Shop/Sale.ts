import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { CHARACTERSELLITEMPRICEREDUCTION } from 'src/gameLogic/custom/customTypes/constants';
import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';

export class Sale
{
  items2Character:GameItem[]=[];
  items2Shop:GameItem[]=[];
  get total(){return this.__total();}
  constructor(){}

  addItem2Character(item:GameItem){
    for(const shopItem of this.items2Character)
      if(this.didAddItemAmounts(shopItem, item))return;
    this.items2Character.push(item)
  }

  addItem2Shop(item:GameItem) {
    for(const shopItem of this.items2Shop)
      if(this.didAddItemAmounts(shopItem, item))return;
    this.items2Shop.push(item)
  }
  removeItem2Character(shopItem:GameItem,amount:number):void {
    shopItem.amount-=amount;
    (shopItem.amount<=0) && removeItem(this.items2Character, shopItem)
  }
  removeItem2Shop(shopItem:GameItem,amount:number):void {
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
  private didAddItemAmounts(shopItem: GameItem, item: GameItem):boolean {
    if(shopItem.constructor !== item.constructor) return false
    shopItem.amount += item.amount;
    return true
  }
}
