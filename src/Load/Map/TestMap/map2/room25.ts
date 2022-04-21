import { MasterService } from "src/app/service/master.service";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { fill_room, Room, roomFunction } from "src/gameLogic/custom/Class/maps/room";

export function room25(roomname: string): roomFunction
{
  return {
    roomname,
    create:function(masterService:MasterService): Room{
      const returnToMap1={text:"Map1",action:()=>{masterService.mapHandler.loadRoom("room24")},disabled:false}
      const roomScene: Scene = {
        sceneData: function () {
          return `Sign with ${roomname} written`
        },
        options: (roomname === 'room25') ? [returnToMap1] : [],
        fixedOptions: [null, null, null, null, null]
      }
      return fill_room({
        onEnter: function(){masterService.sceneHandler.tailScene(roomScene,'map').nextScene()},
        onExit: function(){},
        beforeMoveTo: function(roomname: string){return true},
        afterMoveTo: function(roomname: string){},
      })
    }
  }
}
