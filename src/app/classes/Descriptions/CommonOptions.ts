import { MasterService } from "../masterService";
import { DescriptionOptions } from "./Description";
import { selectItem } from "./DescriptionUseItem";

export function DescriptionSelectItemFromMap(masterService:MasterService):DescriptionOptions
{
  return new DescriptionOptions("Item",function(){
    masterService.descriptionHandler.headDescription(selectItem(masterService),'item')
      .setDescription(false);
  })
}

export function nextOption(masterService:MasterService):DescriptionOptions
{
  return new DescriptionOptions("Next",()=>{masterService.descriptionHandler.nextDescription()})
}
