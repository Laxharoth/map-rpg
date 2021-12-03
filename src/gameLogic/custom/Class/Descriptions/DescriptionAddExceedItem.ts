import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { MAXOPTIONSNUMBERPERPAGE } from "src/gameLogic/custom/customTypes/constants";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';


/**
 * Returns a description to drop items if adding a item to inventory exceeds max inventory.
 *
 * @export
 * @param {MasterService} masterService The master service.
 * @param {GameItem} item The item tring to add.
 * @param {Character} character The character to add the inventory.
 * @return {*}  {Description}
 */
export const AddExceedItem = function(){
  const excessItemList:GameItem[] = [];

  return function(masterService:MasterService,item:GameItem,character:Character):Description
  {
    //If the item is already in the excessItemList adds to the stack
    for(const itemInList of excessItemList)
    {
      if(item.constructor === itemInList.constructor)
      {
        MergeItemStacks(item, itemInList);
        if(item.amount<=0)break;
      }
    }
    //Creates stack with remaining amount of items.
    if(item.amount>0)
    {
      const itemStacks:GameItem[] = [];
      while(item.amount>0)
      {
        const itemAmount = Math.min(item.amount, item.maxStack);
        itemStacks.push(ItemFactory(masterService,item.name,{amount:itemAmount}));
        item.amount-=itemAmount;
      }
      excessItemList.push(...itemStacks);
    }
    /** @type {*} {DescriptionOptions} Goes to the next item in excessItemList*/
    const dropItemOption: DescriptionOptions = new DescriptionOptions('Drop Item',nextItemInList);
    /** @type {*} {DescriptionOptions[]} Option to replace the homologue item with the excess Item*/
    const ExceedItemOptions:DescriptionOptions[] = [];
    /** @type {*} {Description} Description to replace item in inventory with excee item.*/
    const ExceedItemDescription:Description =  new Description(
      ()=>`Fitting ->${excessItemList[0].name}x${excessItemList[0].amount}`
      +`\nItems in inventory:\n${character.inventory.map(item => `->${item.name}`).join('\n')}`
      ,ExceedItemOptions
      )
    //Fill the optionns with items in character in inventory.
    updateExceedItemOptions();
    return ExceedItemDescription;
    /**
     * Replaces the item in inventory with the current first excessItemList.
     *
     * @param {GameItem} characteritem The item to replace.
     */
    function removeItemFrominventory(characteritem: GameItem){
        const item = excessItemList[0];
        if (characteritem.constructor !== item.constructor) {
          //Remove the selected item from the in inventory
          const index = character.inventory.indexOf(characteritem);
          character.inventory.splice(index, 1);
          //Adds the new item to the inventory
          character.addItem(item);
        }
        //Changes to the next item in the excessItemList
        nextItemInList();
    }
    /**
     * Changes to the next item in the excessItemList.
     * @returns
     */
    function nextItemInList() {
      excessItemList.splice(0,1)
      if (excessItemList.length === 0) return masterService.descriptionHandler.nextDescription(false);
      updateExceedItemOptions();
      return masterService.descriptionHandler.setDescription(false);
    }
    /**
     * Changeds the DescriptionOptions to update new inventory.
     *
     * @return {*}
     */
    function updateExceedItemOptions():void
    {
      ExceedItemOptions.splice(0,ExceedItemOptions.length)
      if (character.inventory.length + 1 < MAXOPTIONSNUMBERPERPAGE) {
        for (const characteritem of character.inventory)
          ExceedItemOptions.push(new DescriptionOptions(characteritem.name,()=>removeItemFrominventory(characteritem)));
        while (character.inventory.length + 1 < MAXOPTIONSNUMBERPERPAGE)
          ExceedItemOptions.push(null);
        ExceedItemOptions.push(dropItemOption);
        return;
      }
      for (let index = 0; index < character.inventory.length; index++)
      {
        const characteritem = character.inventory[index];
        ExceedItemOptions.push(new DescriptionOptions(characteritem.name,()=>removeItemFrominventory(characteritem)));
        if (ExceedItemOptions.length % MAXOPTIONSNUMBERPERPAGE-2 === MAXOPTIONSNUMBERPERPAGE-3)
          ExceedItemOptions.push(dropItemOption);
      }
      while ((ExceedItemOptions.length + 1) % 8 !== 0)
        ExceedItemOptions.push(null);
      ExceedItemOptions.push(dropItemOption);
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
}();

