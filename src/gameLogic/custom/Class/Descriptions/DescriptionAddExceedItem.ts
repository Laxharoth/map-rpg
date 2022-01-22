import { MasterService } from "src/app/service/master.service";
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { fillItemStoreable, GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { Inventory } from "../Character/Inventory/Inventory";
/**
 * Returns a description to drop items if adding a item to inventory exceeds max inventory.
 *
 * @export
 * @param {MasterService} masterService The master service.
 * @param {GameItem} item The item tring to add.
 * @param {Character} character The character to add the inventory.
 * @return {*}  {Description}
 */
export const AddExceedItem = function () {
  let dropping=false;
  const excessItemList: GameItem[] = [];
  const dropable_inventory=[],dropable_item=[];
  return function (masterService: MasterService, items: GameItem|GameItem[], inventory: Inventory): void {
    if(items instanceof GameItem) items = [items];
    //If the item is already in the excessItemList adds to the stack
    for (const item of items){
      for (const itemInList of excessItemList) {
        if (item.constructor === itemInList.constructor) {
          MergeItemStacks(item, itemInList);
          if (item.amount <= 0) break;
        }
        //If there are remaining items create a stack with remaining amount of items.
      }
      if (item.amount > 0)
        excessItemList.push(...create_stacks_with_remaining_items(item, masterService));
    }
    //replace content of dropable lists
    const [_dropable_inventory,_dropable_item] = map_dropables(inventory.items,excessItemList)
    dropable_inventory.splice(0,dropable_inventory.length,..._dropable_inventory)
    dropable_item.splice(0,dropable_item.length,..._dropable_item)
    /** @type {*} {Description} Description to replace item in inventory with excee item.*/
    //only create description if not already in the description
    if(!dropping)
    {
      dropping = true;
      //Option to drop the marked item
      const ExceedItemOptions: DescriptionOptions[] = [{text:"next",action:()=>drop_exess_items(),disabled:false}];
      const ExceedItemDescription: Description = {
        descriptionData:() => [dropable_inventory,dropable_item],
        options:ExceedItemOptions,
        fixed_options:[null,null,null,null,null]
      };

      masterService.descriptionHandler.tailDescription(ExceedItemDescription,'excess-item');
    }
    masterService.descriptionHandler.setDescription(false)

    function drop_exess_items()
    {
      for(const [drop,item] of dropable_inventory)
      {
        if(drop)inventory.dropItem(item);
      }
      excessItemList.splice(0,excessItemList.length)
      dropping = false;
      masterService.descriptionHandler.nextDescription(false);
      for(const [drop,item] of dropable_item)
      {
        if(!drop)inventory.addItem(item);
      }
    }
  }
  /**
   * 'Moves' the items from the first stack to the second until the second stack is full.
   *
   * @param {GameItem} item2TakeFrom The item to take items from.
   * @param {GameItem} item2Fill The item stack to fill.
   */
  function MergeItemStacks(item2TakeFrom: GameItem, item2Fill: GameItem) {
    const item2AddAmount = item2TakeFrom.amount;
    const item2FillCurrentAmount = item2Fill.amount;
    const newItemInListAmount = Math.min(item2TakeFrom.maxStack, item2AddAmount + item2FillCurrentAmount);
    item2Fill.amount = newItemInListAmount;
    const ItemAmountReduced = newItemInListAmount - item2FillCurrentAmount;
    item2TakeFrom.amount -= ItemAmountReduced;
  }
  function map_dropables(character_items:GameItem[],excess_items:GameItem[]):[character_dropables:game_item_dropable[],excess_items_dropables:game_item_dropable[]] {
    return[
      character_items.map(item=>[false,item]),
      excess_items?.map(item=>[true,item]),
    ]
  }
}();

export type game_item_dropable = [droped:boolean,item:GameItem]
function create_stacks_with_remaining_items(item: GameItem, masterService: MasterService) {
  const itemStacks: GameItem[] = [];
  while (item.amount > 0) {
    const itemAmount = Math.min(item.amount, item.maxStack);
    itemStacks.push(ItemFactory(masterService, fillItemStoreable({
      type: item.name,
      amount: itemAmount
    })));
    item.amount -= itemAmount;
  }
  return itemStacks;
}

