import { Description, DescriptionOptions } from "../classes/Description";
import { Room } from "../classes/maps/room";
import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { MapHandlerService } from "../service/map-handler.service";

export function room(roomName: string,flagshandler:FlagHandlerService,descriptionhandler:DescriptionHandlerService, maphandler:MapHandlerService):Room
{
  const $flag = (name:string) => flagshandler.getFlag(name);
  const nextOption      = new DescriptionOptions("next",function(){descriptionhandler.nextDescription()});
  const roomOptions =[
    new DescriptionOptions("option1",function(){flagshandler.setFlag("",0)}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option2",function(){}),
    new DescriptionOptions("option3",function(){})
  ]
  const roomDescription  = new Description(function(){return `This actually looks the same`},roomOptions)
  const cantGoThere      = new Description(function(){return `I didn't wanted to go there anyway`},[nextOption]);
  const cantGoThereYet   = new Description(function(){return `I didn't wanted to go there yet anyway`},[nextOption]);
  const goBackThere      = new Description(function(){return `Guess I will go back`},[nextOption]);
  const goBackThere2     = new Description(function(){return `little choices i have`},[nextOption]);
  const room = new Room({
    onEnter  : () => {
      descriptionhandler.tailDescription(roomDescription)
      descriptionhandler.nextDescription();
    },
    onExit   : () => {},
    beforeMoveTo(roomName){
      //if(["room6","room8"].includes(roomName))
      if(["room6"].includes(roomName))
      {
        descriptionhandler.headDescription(cantGoThere);
        descriptionhandler.setDescription();
        return false;
      }
      if(["room8"].includes(roomName) && $flag("firstreturn2room1"))
      {
        descriptionhandler.headDescription(cantGoThereYet);
        descriptionhandler.setDescription();
        return false;
      }
      if(roomName === "room1")
      {
        if($flag("firstreturn2room1"))
        {
          flagshandler.setFlag("firstreturn2room1",false);
          descriptionhandler.tailDescription(goBackThere,goBackThere2);
        }
      }
      return true;
    },
    icon:""
    })
  return room;
}

