import { charTest } from "../classes/Character/NPC/characterTest";
import { testformation } from "../classes/Character/NPC/EnemyFormations/testformation";
import { enemyTest } from "../classes/Character/NPC/enemyTest";
import { Description, DescriptionOptions } from "../classes/Descriptions/Description";
import { descriptionFight } from "../classes/Descriptions/DescriptionFight";
import { Room } from "../classes/maps/room";
import { MasterService } from "../classes/masterService";

export function room(masterService:MasterService):Room
{
  const roomName = 'room7'
  const $flag = (name:string) => masterService.flagsHandler.getFlag(name);
  const nextOption      = new DescriptionOptions("next",function(){masterService.descriptionHandler.nextDescription()});
  const roomOptions =[
    new DescriptionOptions("option1",function(){masterService.flagsHandler.setFlag("",0)}),
    new DescriptionOptions("test battle",function(){ descriptionFight(masterService,new testformation(masterService) ) }),
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
      masterService.descriptionHandler.tailDescription(roomDescription)
      masterService.descriptionHandler.nextDescription();
    },
    onExit   : () => {},
    beforeMoveTo(roomName){
      //if(["room6","room8"].includes(roomName))
      if(["room6"].includes(roomName))
      {
        masterService.descriptionHandler.headDescription(cantGoThere);
        masterService.descriptionHandler.setDescription();
        return false;
      }
      if(["room8"].includes(roomName) && $flag("firstreturn2room1"))
      {
        masterService.descriptionHandler.headDescription(cantGoThereYet);
        masterService.descriptionHandler.setDescription();
        return false;
      }
      if(roomName === "room1")
      {
        if($flag("firstreturn2room1"))
        {
          masterService.flagsHandler.setFlag("firstreturn2room1",false);
          masterService.descriptionHandler.tailDescription(goBackThere,goBackThere2);
        }
      }
      return true;
    },
    icon:""
    })
  return room;
}

