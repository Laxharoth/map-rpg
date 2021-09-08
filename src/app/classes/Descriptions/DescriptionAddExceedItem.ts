import { Character } from "../Character/Character";
import { Item } from "../Items/Item";
import { MasterService } from "../masterService";
import { Description, DescriptionOptions } from "./Description";

export function AddExceedItem(masterService:MasterService,item:Item,character:Character):Description
{
  const dropItemOption = new DescriptionOptions('Drop Item', () => { masterService.descriptionHandler.nextDescription(false); });
  const ExceedItemOptions:DescriptionOptions[] = [];
  const ExceedItemDescription =  new Description(
    ()=>``
    ,ExceedItemOptions
    )

  if(character.inventary.length+1<10)
  {
    for(const characteritem of character.inventary)
      ExceedItemOptions.push(new DescriptionOptions(characteritem.name,removeItemFromInventary(characteritem, item, masterService, character)))
    while(character.inventary.length+1<10) ExceedItemOptions.push(null);
    ExceedItemOptions.push(dropItemOption)
  }
  else
  {
    for(let index = 0; index < character.inventary.length; index++)
    {
      const characteritem = character.inventary[index];
      ExceedItemOptions.push(new DescriptionOptions(characteritem.name ,removeItemFromInventary(characteritem,item,masterService, character)))
      if(ExceedItemOptions.length%8===7) ExceedItemOptions.push(dropItemOption);
    }
    while((ExceedItemOptions.length+1)%8!==0) ExceedItemOptions.push(null);
    ExceedItemOptions.push(dropItemOption)
  }
  return ExceedItemDescription;
}
function removeItemFromInventary(characteritem: Item, item: Item, masterService: MasterService, character: Character): () => void {
  return () => {
    if (characteritem.constructor === item.constructor) {
      masterService.descriptionHandler.nextDescription(false);
      return;
    }
    const index = character.inventary.indexOf(characteritem);
    character.inventary.splice(index, 1);
    const [description] = character.addItem(item);
    masterService.descriptionHandler.afterHeadDescription(...description);
    masterService.descriptionHandler.nextDescription(false);
  };
}

