import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { AddExceedItem } from './DescriptionAddExceedItem';
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

export function drop_item(masterService:MasterService,character:Character)
{
  return new DescriptionOptions("Drop Item",function(){
    AddExceedItem(masterService,[],character.inventory)
  })
}
