import { flagname } from 'src/gameLogic/configurable/subservice/flag-handler.type';
import { MasterService } from "src/app/service/master.service";
import { RoomFunction } from "src/gameLogic/custom/Class/maps/room";
import { SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { harperFinishQuest, harperGivesQuest, talkHarper } from './harperScenes';
import { FactoryForModules } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';

const entranceString={
  entrance1:" // TODO add scene string",
  entrance2:" // TODO add scene string",
  entrance3:" // TODO add scene string",
  entrance5:" // TODO add scene string",
  entrance6:" // TODO add scene string",
  entrance7:" // TODO add scene string",
  entrance8:" // TODO add scene string",
  entrance9:" // TODO add scene string",
}
export function entrace(roomname: string, Factory:FactoryForModules):RoomFunction{
  return {
    roomname,
    create(masterService:MasterService){
      const {sceneHandler} = masterService;
      const $$ = getFlagShortcut(masterService);
      const options:SceneOptions[] = [];
      switch(roomname){
        case "entrance1":options.push(Factory.options.enterRoomOption(masterService,"street2","Exit the Mansion",!$$("talked-with-harper")));break;
        case "entrance7":
        case "entrance9":
        case "entrance2":
        case "entrance3":options.push(
          Factory.options.enterRoomOption(masterService,"","The door is closed",true));break;
      }
      return {
        onEnter(){
          Factory.enterRoom(masterService.sceneHandler,()=>entranceString[roomname as 'entrance1'] ,options,
            // @ts-ignore
            Factory.options.roomOptions(masterService));
        },
        onExit(){return null;},
      }
    }
  }
}
export function stairs(Factory:FactoryForModules):RoomFunction{
  return {
    roomname:"mstairs",
    create(masterService:MasterService){
      const {sceneHandler} = masterService;
      return {
        onEnter(){
          Factory.enterRoom(masterService.sceneHandler,()=>'the is a stair' ,[],
            // @ts-ignore
            Factory.options.roomOptions(masterService));
        },
        onExit(){return null;},
      }
    }
  }
}
export function upper(Factory:FactoryForModules):RoomFunction{
  return {
    roomname:"upper",
    create(masterService:MasterService){
      const $$ = getFlagShortcut(masterService);
      const { sceneHandler } = masterService;
      const options:SceneOptions[] = [{
        text:"Talk", action:() => {
        masterService.sceneHandler.headScene(talkHarper(masterService,Factory),"talk").setScene();
        },disabled:false}
    ]
      return {
        onEnter(){
          Factory.enterRoom(masterService.sceneHandler,()=>'Upper room the harper is here' ,options,
            // @ts-ignore
            Factory.options.roomOptions(masterService));
          if(!$$("talked-with-harper")){
            $$("talked-with-harper",true);
            sceneHandler.tailScene(harperGivesQuest(masterService,Factory),"talk");
          }
          if($$("first-close-spy")){
            sceneHandler.tailScene(harperFinishQuest(masterService,Factory),"talk");
          }
          sceneHandler.setScene();
        },
        onExit(){return null;},
      }
    }
  }
}
function getFlagShortcut(masterService: MasterService){
  return (flag: flagname, value?: any) => {
    if (value) { masterService.flagsHandler.setFlag(flag, value); }
    return masterService.flagsHandler.getFlag(flag);
  }
}
