import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { AddExceedItem } from './SceneAddExceedItem';
import { MasterService } from "src/app/service/master.service";
import { DescriptableSceneOptions, SceneOptions } from "./Scene";
import { selectItemOverworld } from "./SceneUseItem";

export function SceneSelectItemFromMap(masterService:MasterService):SceneOptions
{
  return {
    text:"Item",action:function(){
    masterService.sceneHandler.headScene(selectItemOverworld(masterService),'item')
      .setScene(false);
    },
    get disabled():boolean { return masterService.lockmap.isMapLocked();}
  }
}

export function nextOption(masterService:MasterService,btnString:string="Next"):SceneOptions
{
  return {text:btnString,action:()=>{masterService.sceneHandler.nextScene()},disabled:false}
}
export function enterRoomOption(masterService:MasterService,roomname:string,disabled:(()=>boolean)|boolean=false):DescriptableSceneOptions{
  return {
    action(){ masterService.mapHandler.loadRoom(roomname); },
    text:"Enter",
    get disabled():boolean{ return ( typeof disabled === "function")?disabled():disabled; },
    descriptable:{
      description:[
        {name:"description",section_items:[{name:"description",value:`Enter ${roomname}`}]}
      ]
    }
  }
}
export function drop_item(masterService:MasterService,character:Character)
{
  return {text:"Drop Item",action:function(){ AddExceedItem(masterService,[],character.inventory) },disabled:false}
}
