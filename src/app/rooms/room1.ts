import { Description, DescriptionOptions } from "../classes/Description";
import { Room } from "../classes/maps/room";
import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { MapHandlerService } from "../service/map-handler.service";

export function room(roomName: string,flagshandler:FlagHandlerService,descriptionhandler:DescriptionHandlerService, maphandler:MapHandlerService):Room
{
  const $flag = (name:string,value:any=null) =>{
    if(value!==null) flagshandler.setFlag(name,value);
    return flagshandler.getFlag(name)
  };

  const nextOption      = new DescriptionOptions("next",function(){descriptionhandler.nextDescription()});
  const yesOption      = (action:()=>void)=>new DescriptionOptions("Yes",function(){action()});
  const noOption      = new DescriptionOptions("No",function(){descriptionhandler.nextDescription()});
  const furtherDescription = new Description(function(){return `There is nothing to do.`},[nextOption])

  const roomOptions =[
    new DescriptionOptions("option1",function(){
      descriptionhandler.headDescription(furtherDescription);
      descriptionhandler.setDescription();
    }),
    new DescriptionOptions("save",function(){
      flagshandler.save("save1");
    }),
    new DescriptionOptions("option3",function(){},true),
    new DescriptionOptions("unlock 3",function(){
      let index = 0;
      let option = roomOptions[index];
      while(option.text!== "option3" && index < roomOptions.length)
        option = roomOptions[++index];
      if(index < roomOptions.length)
      {
        if(option.disabled)
        {
          option.disabled = false;
          this.text = "lock 3";
          return;
        }
        option.disabled = true;
          this.text = "unlock 3";
      }
    }),
    new DescriptionOptions("option5",function(){}),
    null,
    new DescriptionOptions("option6",function(){}),
  ]
  if($flag("caninroom1")){
      roomOptions.splice(2,0,new DescriptionOptions("kick can",function(){
        descriptionhandler.headDescription(kickCanDescription);
        descriptionhandler.setDescription();
        $flag("caninroom1",false);
        roomOptions.splice(2,1);
    }))
  }
  if(roomName==='room20'){
    const flyDescription1 =  new Description(function(){return `AAAAAAAAh`},[nextOption])
    const flyDescription2 =  new Description(function(){return `I can see the place where I started`},[nextOption])
    const flyDescription3 =  new Description(function(){return `That was something`},[nextOption])
    const cannonDescription = new Description(function(){return `Dafuk there is a cannon here.\n enter the cannon?`;}
    ,[yesOption(()=>{
      descriptionhandler.nextDescription();
      descriptionhandler.tailDescription(flyDescription1, flyDescription2,flyDescription3);
      maphandler.loadRoom('room1');
    }),noOption])
    roomOptions.splice(2,0, new DescriptionOptions("Cannon",function(){
      descriptionhandler.headDescription(cannonDescription);
      descriptionhandler.setDescription();
      })
    )
  }
  const fistEnter       = new Description(function(){return `It's the first time`},[nextOption]);
  const roomDescription = new Description(function(){return `I look at the${(roomName!=='room1')?' same':''} room ${$flag("map1room1firstenter")?"FOR THE VERY FIRST TIME":"AGAIN."}
    ${(roomName!=='room1')?`but it's room '${roomName}'`:''}
  `}
  ,roomOptions)
  const firstExit = new Description(function(){return `It was the first time`},[nextOption]);
  const kickCanDescription =  new Description(function(){return `You kick the can, it's fun.
                                  The can flew away`}
                              ,[nextOption]
                              )

  const room = new Room({
    onEnter  : () => {
      if($flag("map1room1firstenter")){
        descriptionhandler.tailDescription(fistEnter);
      }
      descriptionhandler.tailDescription(roomDescription)
      descriptionhandler.nextDescription();
    },
    onExit   : () => {
      if($flag("map1room1firstexit"))
      {
        $flag("map1room1firstenter",false)
        $flag("map1room1firstexit",false);
        descriptionhandler.tailDescription(firstExit);
      }
    },
    beforeMoveTo(roomName){
      return true;
    },
    icon:""
    })
  return room;
}

