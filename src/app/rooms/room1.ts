import { Description, DescriptionOptions } from "../classes/Description";
import { Room } from "../classes/maps/room";
import { getInputs } from "../htmlHelper/htmlHelper.functions";
import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { MapHandlerService } from "../service/map-handler.service";

export function room(roomName: string)
{
  return function(flagshandler:FlagHandlerService,descriptionhandler:DescriptionHandlerService, maphandler:MapHandlerService):Room
  {
    const $flag = (name:string,value:any=null) =>{
      if(value!==null) flagshandler.setFlag(name,value);
      return flagshandler.getFlag(name)
    };

  const nextOption      = new DescriptionOptions("next",function(){descriptionhandler.nextDescription(false)});
  const yesOption      = (action:()=>void)=>new DescriptionOptions("Yes",function(){action()});
  const noOption      = new DescriptionOptions("No",function(){descriptionhandler.nextDescription()});
  const nextOptionInputs = new DescriptionOptions("next",function(){
    const {input,select} = getInputs();
    $flag('petshout',input);
    if(input===''){$flag('petshout',null);}
    if(select){$flag('pet',select);}
    descriptionhandler.nextDescription(false)
  });
  //with input and select
  const furtherDescription = new Description(function(){return `There is \\input{"default":"${$flag('petshout')||''}","placeholder":"nothing"}\\ to do. Except to select \\select["cat","dog"]\\ but does nothing`+
  //without input with select
  //const furtherDescription = new Description(function(){return `There is to do. Except to select \\select["cat","dog"]\\ but does nothing`+
  //with input without select
  //const furtherDescription = new Description(function(){return `There is \\input{"placeholder":"nothing"}\\ to do. Except to select but does nothing\n\n`+
  `${($flag('pet'))?`\n\nOMG there is a ${$flag('pet')}`:``}`+
  `${($flag('pet')&&$flag('petshout'))?` 'it's saying ${$flag('petshout')}'`:``}`},[nextOptionInputs])
  const roomOptions =[
    new DescriptionOptions("option1",function(){
      descriptionhandler.headDescription(furtherDescription);
      descriptionhandler.setDescription(false);
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
      new DescriptionOptions("add 1 hour",function(){ flagshandler.addTime("1h") }),
      null,
    new DescriptionOptions("add 1 month",function(){ flagshandler.addTime("1M") }),
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
      flagshandler.addTime('30m');
      maphandler.loadRoom('room1');
    }),noOption])
    roomOptions.splice(2,0, new DescriptionOptions("Cannon",function(){
      descriptionhandler.headDescription(cannonDescription);
      descriptionhandler.setDescription();
      })
      )
    }
    const fistEnter       = new Description(function(){return `It's the first time`},[nextOption]);
  const roomDescription = new Description(function(){return `I look at the${(roomName!=='room1')?' same':''} room ${$flag("map1room1firstenter")?"FOR THE VERY FIRST TIME":"AGAIN."}${(roomName!=='room1')?`\nbut it's room '${roomName}'`:''}
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
      if(roomName!=='room1')
      {flagshandler.addTime('5m')}
      return true;
    },
    icon:""
  })
  return room;
}
}
