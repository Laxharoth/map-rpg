import { MAXOPTIONSNUMBERPERPAGE } from "src/app/customTypes/constants";
import { Character } from "../Character/Character";
import { ItemFactory } from "../Character/Factory/ItemFactory";
import { Item } from "../Items/Item";
import { MasterService } from "src/app/service/master.service";
import { Description, DescriptionOptions } from "./Description";

/**
 * Returns a description to drop items if adding a item to inventary exceeds max inventary.
 *
 * @export
 * @param {MasterService} masterService The master service.
 * @param {Item} item The item tring to add.
 * @param {Character} character The character to add the inventary.
 * @return {*}  {Description}
 */
export const AddExceedItem = function(){
  const excessItemList:Item[] = [];

  return function(masterService:MasterService,item:Item,character:Character):Description
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
      const itemStacks:Item[] = [];
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
    /** @type {*} {Description} Description to replace item in inventary with excee item.*/
    const ExceedItemDescription:Description =  new Description(
      ()=>`Fitting ->${excessItemList[0].name}x${excessItemList[0].amount}`
      +`\nItems in inventary:\n${character.inventary.map(item => `->${item.name}`).join('\n')}`
      ,ExceedItemOptions
      )
    //Fill the optionns with items in character in inventary.
    updateExceedItemOptions();
    return ExceedItemDescription;
    /**
     * Replaces the item in inventary with the current first excessItemList.
     *
     * @param {Item} characteritem The item to replace.
     */
    function removeItemFromInventary(characteritem: Item){
        const item = excessItemList[0];
        if (characteritem.constructor !== item.constructor) {
          //Remove the selected item from the in inventary
          const index = character.inventary.indexOf(characteritem);
          character.inventary.splice(index, 1);
          //Adds the new item to the inventary
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
     * Changeds the DescriptionOptions to update new inventary.
     *
     * @return {*}
     */
    function updateExceedItemOptions():void
    {
      ExceedItemOptions.splice(0,ExceedItemOptions.length)
      if (character.inventary.length + 1 < MAXOPTIONSNUMBERPERPAGE) {
        for (const characteritem of character.inventary)
          ExceedItemOptions.push(new DescriptionOptions(characteritem.name,()=>removeItemFromInventary(characteritem)));
        while (character.inventary.length + 1 < MAXOPTIONSNUMBERPERPAGE)
          ExceedItemOptions.push(null);
        ExceedItemOptions.push(dropItemOption);
        return;
      }
      for (let index = 0; index < character.inventary.length; index++)
      {
        const characteritem = character.inventary[index];
        ExceedItemOptions.push(new DescriptionOptions(characteritem.name,()=>removeItemFromInventary(characteritem)));
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
   * @param {Item} item2TakeFrom The item to take items from.
   * @param {Item} item2Fill The item stack to fill.
   */
  function MergeItemStacks(item2TakeFrom: Item, item2Fill: Item) {
    const item2AddAmount = item2TakeFrom.amount;
    const item2FillCurrentAmount = item2Fill.amount;
    const newItemInListAmount = Math.min(item2TakeFrom.maxStack, item2AddAmount + item2FillCurrentAmount);
    item2Fill.amount = newItemInListAmount;
    const ItemAmountReduced = newItemInListAmount - item2FillCurrentAmount;
    item2TakeFrom.amount -= ItemAmountReduced;
  }
}();

