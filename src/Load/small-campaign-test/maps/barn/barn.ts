import { MasterService } from 'src/app/service/master.service';
import { flagname } from 'src/gameLogic/configurable/subservice/flag-handler.type';
import { FactoryForModules } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { RoomFunction } from "src/gameLogic/custom/Class/maps/room";
import { SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { sellerScene } from './sellerScenes';
import { thugIntroScene } from './thug';

export function barn(roomname:string,Factory:FactoryForModules):RoomFunction{
  const sceneStrings = {
    room1:"//TODO add scene",
    room2:"//TODO add scene",
    room3:"//TODO add scene",
    room4:"//TODO add scene",
    room5:"//TODO add scene",
    room6:"//TODO add scene",
    room7:"//TODO add scene",
    room8:"//TODO add scene",
    room9:"//TODO add scene",
  }
  return {
    create:(masterService:MasterService)=>{
      const $$ = (flag:flagname,value?:any)=>{
        if(value !== undefined)masterService.flagsHandler.setFlag(flag,value);
        return masterService.flagsHandler.getFlag(flag);
      }
      const options:SceneOptions[]=[];
      if(roomname==="barn8")options.push(Factory.options.enterRoomOption(masterService,"street7","Exit the barn"));
      return {
        onEnter(){
          Factory.enterRoom(masterService.sceneHandler,()=>sceneStrings[roomname as 'room1'],options,
            // @ts-ignore
            Factory.options.roomOptions(masterService));
          if(roomname==="barn8" && !$$("first-enter-barn")){
            $$("first-enter-barn",true);
          }
          if(roomname==="barn8" && $$("first-close-spy") && !$$("fought-thug")){
            $$("fought-thug",true);
            masterService.sceneHandler.headScene(thugIntroScene(masterService,Factory),"talk");
          }
          if((roomname==="barn2"||roomname==="barn4") && !$$("first-close-spy")){
            $$("first-close-spy",true);
            masterService.sceneHandler.headScene(sellerScene(masterService,Factory),"talk");
          }
          masterService.sceneHandler.setScene();
        },
        onExit(){return null;},
      }
    },
    roomname,
  }
}
export const stairs:RoomFunction={
  create:(masterService:MasterService)=>{
    return {
      onEnter(){return null;},onExit(){return null;},
    }
  },
  roomname:"stairs",
  disabled:(_)=>true
}
export const loft:RoomFunction={
  create:(masterService:MasterService)=>{
    return {
      onEnter(){return null;},onExit(){return null;},
    }
  },
  roomname:"loft",
  disabled:(_)=>true
}
export const secretExit:RoomFunction={
  create:(masterService:MasterService)=>{
    return {
      onEnter(){return null;},onExit(){return null;},
    }
  },
  roomname:"secret_exit",
  disabled:(_)=>true
}
