import { MasterService } from "src/app/service/master.service";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { Room } from "src/gameLogic/custom/Class/maps/room";

export function room25(roomname: string)
{
  return function(masterService:MasterService): Room
  {
    const returnToMap1=new DescriptionOptions("Map1",function(){masterService.mapHandler.loadRoom("room24")})
    const roomDescription  = new Description(function () {return `Sign with ${roomname} written`},(roomname==='room25')?[returnToMap1]:[])
    return new Room({
      onEnter: function(){masterService.descriptionHandler.tailDescription(roomDescription,'map').nextDescription()},
      onExit: function(){},
      beforeMoveTo: function(roomname: string){return true},
      afterMoveTo: function(roomname: string){},
      icon:null
    })
  }
}
