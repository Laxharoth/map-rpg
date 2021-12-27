import { MasterService } from "src/app/service/master.service";
import { DescriptionOptions } from "./Description";
import { selectItemOverworld } from "./DescriptionUseItem";

export function DescriptionSelectItemFromMap(masterService:MasterService):DescriptionOptions
{
  return new DescriptionOptions("Item",function(){
    masterService.descriptionHandler.headDescription(selectItemOverworld(masterService),'item')
      .setDescription(false);
  })
}

export function nextOption(masterService:MasterService,btnString:string="Next"):DescriptionOptions
{
  return new DescriptionOptions(btnString,()=>{masterService.descriptionHandler.nextDescription()})
}
