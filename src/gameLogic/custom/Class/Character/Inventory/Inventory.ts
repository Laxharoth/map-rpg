import { AddExceedItem } from 'src/gameLogic/custom/Class/Scene/SceneAddExceedItem';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { storeable, StoreableType } from 'src/gameLogic/core/Factory/Factory';
import { MasterService } from 'src/app/service/master.service';
import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { ActionOutput } from '../Character.type';
import { Character } from '../Character';
export class Inventory implements storeable {
  readonly type:string="Inventory"
  inventory_size = 9;
  items: GameItem[] = [];
  master_service: MasterService;
  constructor(master_service: MasterService) {
    this.master_service = master_service;
  }
  /**
   * Adds Item to the inventory.
   *
   * @param {GameItem} item The item to add.
   * @return { void }
   * @memberof Character
   */
  addItem(item: GameItem): void {
    if (!item) {
      console.warn("Item not found, Is null or undefined.");
      return;
    }
    this.fitItemIntoinventory(item);
    if (item.amount <= 0) return;
    if (this.items.length < this.inventory_size) {
      if (item.amount <= item.maxStack) {
        this.items.push(item);
        return;
      }
      for (const itemsFromStack of item.breakIntoStacks()) this.addItem(itemsFromStack);
      return;
    }
    AddExceedItem(this.master_service, item, this)
  }
  dropItem(item: GameItem) { removeItem(this.items, item); }
  /**
   * Check if the Item can be Inserted into the inventory.
   *
   * @private
   * @param {GameItem} item
   * @memberof Character
   */
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
  /**
   * Use an item from inventory
   *
   * @param {(number|GameItem)} itemIndexOrItem The Index of the item or the item.
   * @param {Character[]} targets The targets the item will target.
   * @return { ActionOutput }
   * @memberof Character
   */
  useItem(itemIndexOrItem: GameItem, source:Character, targets: Character[]): ActionOutput {
    let itemIndex: number;
    if (itemIndexOrItem instanceof GameItem) itemIndex = this.items.indexOf(itemIndexOrItem);
    if (itemIndex < 0) return [[],[]]
    const item = this.items[itemIndex];
    return item.itemEffect(source, targets)
  }

  toJson(): InventoryOptions {
    return {
      Factory: null,
      type: null,
      inventory_size: this.inventory_size,
      items: this.items.map(item => item.toJson())
    }
  }
  fromJson(options: InventoryOptions): void {
    this.inventory_size = options.inventory_size;
    this.items = options.items.map(options => ItemFactory(this.master_service, options))
  }
}

export type InventoryOptions = {
  Factory: null;
  type: null;
  inventory_size: number;
  items: ItemStoreable[]
}
