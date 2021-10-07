import { testformation } from "../classes/Character/NPC/EnemyFormations/testformation";
import { enemyTest } from "../classes/Character/NPC/enemyTest";
import { Description, DescriptionOptions } from "../classes/Descriptions/Description";
import { descriptionBattle } from "../classes/Descriptions/BattleDescription";
import { Room } from "../classes/maps/room";
import { MasterService } from "src/app/service/master.service";
import { roomFunction } from "../customTypes/customTypes";
import { getInputs, randomBetween, randomCheck } from "../htmlHelper/htmlHelper.functions";

export function room(roomName: string):roomFunction
{
  return function(masterService:MasterService):Room
  {
    const $flag = (name:string,value:any=null) =>{
      if(value!==null) masterService.flagsHandler.setFlag(name,value);
      return masterService.flagsHandler.getFlag(name)
    };

  const nextOption      = new DescriptionOptions("next",function(){masterService.descriptionHandler.nextDescription(false)});
  const yesOption      = (action:()=>void)=>new DescriptionOptions("Yes",function(){action()});
  const noOption      = new DescriptionOptions("No",function(){masterService.descriptionHandler.nextDescription()});
  const nextOptionInputs = new DescriptionOptions("next",function(){
    const {input,select} = getInputs();
    $flag('petshout',input);
    if(input===''){$flag('petshout',null);}
    if(select){$flag('pet',select);}
    masterService.descriptionHandler.nextDescription(false)
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
      masterService.descriptionHandler.headDescription(furtherDescription,'map');
      masterService.descriptionHandler.setDescription(false);
    }),
    new DescriptionOptions("save",function(){
      masterService.flagsHandler.save("save1",masterService);
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
      new DescriptionOptions("add 1 hour",function(){ masterService.flagsHandler.addTime("1h") }),
      null,
    new DescriptionOptions("add 1 month",function(){ masterService.flagsHandler.addTime("1M") }),
    new DescriptionOptions("add 100 gold",function(){ masterService.partyHandler.user.originalstats.gold += 100}),
  ]
  if($flag("caninroom1")){
    roomOptions.splice(2,0,new DescriptionOptions("kick can",function(){
        masterService.descriptionHandler.headDescription(kickCanDescription,'map');
        masterService.descriptionHandler.setDescription();
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
      masterService.descriptionHandler.nextDescription();
      masterService.descriptionHandler.tailDescription([flyDescription1, flyDescription2,flyDescription3],'map');
      masterService.flagsHandler.addTime('30m');
      masterService.mapHandler.loadRoom('room1');
    }),noOption])
    roomOptions.splice(2,0, new DescriptionOptions("Cannon",function(){
      masterService.descriptionHandler.headDescription(cannonDescription,'map');
      masterService.descriptionHandler.setDescription();
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
        masterService.descriptionHandler.tailDescription(fistEnter,'map');
      }
      masterService.descriptionHandler.tailDescription(roomDescription,'map')
      masterService.descriptionHandler.nextDescription();
      if(randomCheck(10))
      {
        descriptionBattle(masterService,new testformation(masterService))
      }
    },
    onExit   : () => {
      if($flag("map1room1firstexit"))
      {
        $flag("map1room1firstenter",false)
        $flag("map1room1firstexit",false);
        masterService.descriptionHandler.tailDescription(firstExit,'map');
      }
    },
    beforeMoveTo(roomName){
      if(roomName!=='room1')
      {masterService.flagsHandler.addTime('5m')}
      return true;
    },
    icon:""
  })
  return room;
}
}
