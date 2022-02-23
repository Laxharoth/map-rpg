import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { AddExceedItem } from './SceneAddExceedItem';
import { MasterService } from "src/app/service/master.service";
import { SceneOptions } from "./Scene";
import { selectItemOverworld } from "./SceneUseItem";

export function SceneSelectItemFromMap(masterService:MasterService):SceneOptions
{
  return {
    text:"Item",action:function(){
    masterService.sceneHandler.headScene(selectItemOverworld(masterService),'item')
      .setScene(false);
    },
    disabled:false
  }
}

export function nextOption(masterService:MasterService,btnString:string="Next"):SceneOptions
{
  return {text:btnString,action:()=>{masterService.sceneHandler.nextScene()},disabled:false}
}

export function drop_item(masterService:MasterService,character:Character)
{
  return {text:"Drop Item",action:function(){ AddExceedItem(masterService,[],character.inventory) },disabled:false}
}
