import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { AddExceedItem } from './DescriptionAddExceedItem';
import { MasterService } from "src/app/service/master.service";
import { DescriptionOptions } from "./Description";
import { selectItemOverworld } from "./DescriptionUseItem";

export function DescriptionSelectItemFromMap(masterService:MasterService):DescriptionOptions
{
  return {
    text:"Item",action:function(){
    masterService.descriptionHandler.headDescription(selectItemOverworld(masterService),'item')
      .setDescription(false);
    },
    disabled:false
  }
}

export function nextOption(masterService:MasterService,btnString:string="Next"):DescriptionOptions
{
  return {text:btnString,action:()=>{masterService.descriptionHandler.nextDescription()},disabled:false}
}

export function drop_item(masterService:MasterService,character:Character)
{
  return {text:"Drop Item",action:function(){ AddExceedItem(masterService,[],character.inventory) },disabled:false}
}
