import { MasterService } from "src/app/service/master.service";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { fill_room, Room } from "src/gameLogic/custom/Class/maps/room";

export function room25(roomname: string)
{
  return function(masterService:MasterService): Room
  {
    const returnToMap1={text:"Map1",action:()=>{masterService.mapHandler.loadRoom("room24")},disabled:false}
    const roomDescription: Description = {
      descriptionData: function () {
        return `Sign with ${roomname} written`
      },
      options: (roomname === 'room25') ? [returnToMap1] : [],
      fixed_options: [null, null, null, null, null]
    }
    return fill_room({
      onEnter: function(){masterService.descriptionHandler.tailDescription(roomDescription,'map').nextDescription()},
      onExit: function(){},
      beforeMoveTo: function(roomname: string){return true},
      afterMoveTo: function(roomname: string){},
      icon:null
    })
  }
}
