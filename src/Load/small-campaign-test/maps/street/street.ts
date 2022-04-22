import { MasterService } from "src/app/service/master.service";
import { FactoryForModules } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { banditsWantRealEgg } from "./bandit";

const streetStrings = {
  street1:"// TODO add scene string",
  street2:"// TODO add scene string",
  street3:"// TODO add scene string",
  street4:"// TODO add scene string",
  street5:"// TODO add scene string",
  street6:"// TODO add scene string",
  street7:"// TODO add scene string",
  street8:"// TODO add scene string",
  street9:"// TODO add scene string",
}
export function street(roomname: string,Factory:FactoryForModules):roomFunction{
  return {
    create(masterService:MasterService){
      const options:SceneOptions[] = [];
      switch(roomname){
        case "street9": options.push(Factory.options.enterRoomOption(masterService,"secret_exit","You hear wind but see no door",true)) ;break;
        case "street2": options.push(Factory
            .options.enterRoomOption(masterService,"entrance1","Enter the Mansion")) ;break;
        case "street7": options.push(Factory.options.enterRoomOption(masterService,"barn8","Enter the Barn")) ;break;
      }
      return {
        onEnter(){
          Factory.enterRoom(masterService.sceneHandler,()=>streetStrings[roomname as 'street1'] ,options,
            // @ts-ignore
            Factory.options.roomOptions(masterService));
          if(masterService.flagsHandler.getFlag("thug-revenge")){
            masterService.flagsHandler.setFlag("thug-revenge",false);
            masterService.sceneHandler.headScene(banditsWantRealEgg(masterService,Factory),"talk").setScene(false);
          }
        },
        onExit(){return null;},
      };
    },
    roomname
  }
}
