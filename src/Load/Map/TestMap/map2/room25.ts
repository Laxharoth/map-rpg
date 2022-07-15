import { MasterService } from "src/app/service/master.service";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { Room, roomFunction } from "src/gameLogic/custom/Class/maps/room";

export function room25(roomname: string): roomFunction{
  return {
    roomname,
    create(masterService:MasterService): Room{
      const returnToMap1={text:"Map1",action:()=>{masterService.mapHandler.loadRoom("room24")},disabled:false}
      const roomScene: Scene = {
        sceneData () {
          return `Sign with ${roomname} written`
        },
        options: (roomname === 'room25') ? [returnToMap1] : [],
        fixedOptions: [null, null, null, null, null]
      }
      return {
        onEnter(){masterService.sceneHandler.tailScene(roomScene,'map').nextScene()},
        onExit(){return undefined},
        beforeMoveTo(){return true},
        afterMoveTo(){return undefined},
      }
    }
  }
}
