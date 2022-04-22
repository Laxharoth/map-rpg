import { AddExceedItem } from 'src/gameLogic/custom/Class/Scene/SceneAddExceedItem';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { MasterService } from 'src/app/service/master.service';
import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { ActionOutput } from '../Character.type';
import { Character } from '../Character';
import { itemname } from '../../Items/Item.type';
export class Inventory implements Storeable {
  readonly type:string="Inventory"
  inventorySize = 9;
  items: GameItem[] = [];
  masterService: MasterService;
  constructor(masterService: MasterService) {
    this.masterService = masterService;
  }
  /** Adds Item to the inventory. */
  addItem(item: GameItem|null): void {
    if (!item) {
      console.warn("Item not found, Is null or undefined.");
      return;
    }
    this.fitItemIntoinventory(item);
    if (item.amount <= 0) return;
    if (this.items.length < this.inventorySize) {
      if (item.amount <= item.maxStack) {
        this.items.push(item);
        return;
      }
      for (const itemsFromStack of item.breakIntoStacks()) this.addItem(itemsFromStack);
      return;
    }
    AddExceedItem(this.masterService, item, this)
  }
  dropItem(item: GameItem,amount: number=-1) {
    if(amount < 0 || amount >= item.amount){removeItem(this.items, item); return;}
    item.amount-=amount;
  }
  /** Check if the Item can be Inserted into the inventory. */
  private fitItemIntoinventory(item: GameItem): void {
    if (item.amount <= 0) return;
    for (const characteritem of this.items) {
      if (characteritem.constructor === item.constructor) {
        const characteriteramount = characteritem.amount;
        const itemamount = item.amount;
        const newcharacteritemamount = Math.min(characteriteramount + itemamount, item.maxStack);
        const newitemamount = itemamount - (newcharacteritemamount - characteriteramount);
        characteritem.amount = newcharacteritemamount;
        item.amount = newitemamount;
      }
    }
  }
  /** Use an item from inventory */
  useItem(itemIndexOrItem: GameItem, source:Character, targets: Character[]): ActionOutput {
    let itemIndex: number = -1;
    if (itemIndexOrItem instanceof GameItem) itemIndex = this.items.indexOf(itemIndexOrItem);
    if (itemIndex < 0) return [[],[]]
    const item = this.items[itemIndex];
    return item.itemEffect(source, targets)
  }
  has(itemName:itemname){
    return this.items.some((item) => item.type === itemName);
  }
  find(itemName:itemname){
    return this.items.find((item) => item.type === itemName);
  }
  toJson(): InventoryOptions {
    return {
      Factory: "Item",
      type: "",
      inventorySize: this.inventorySize,
      items: this.items.map(item => item.toJson())
    }
  }
  fromJson(options: InventoryOptions): void {
    this.inventorySize = options.inventorySize;
    this.items = options.items.map(option => ItemFactory(this.masterService, option))
  }
}

export type InventoryOptions = {
  Factory: "Item";
  type: string;
  inventorySize: number;
  items: ItemStoreable[]
}
