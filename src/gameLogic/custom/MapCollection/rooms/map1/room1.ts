import { battle_options } from './../../../Class/Battle/Battle.type';
import { Battle } from './../../../Class/Battle/Battle';
import { DescriptionSelectItemFromMap, nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { MasterService } from "src/app/service/master.service";
import { flagname } from "src/gameLogic/configurable/subservice/flag-handler.type";
import { testformation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/testformation";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { fill_room, Room, roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { getInputs, randomCheck } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { QuestFactory } from 'src/gameLogic/custom/Factory/QuestFactory';

export function room(roomName: string): roomFunction {
  return function (masterService: MasterService): Room {
    const $flag = (name: flagname, value: any = null) => {
      if (value !== null) masterService.flagsHandler.setFlag(name, value);
      return masterService.flagsHandler.getFlag(name)
    };
    const nextoption = nextOption(masterService)
    const yesOption = (action: ()=>void)=>{return {text:"Yes",action:function(){ action()},disabled: false }}
    const noOption = nextOption(masterService,"No")
    const nextOptionInputs = {
      text:"next",
      action:function () {
        const { input, select } = getInputs();
        $flag('petshout', input);
        if (input === '') { $flag('petshout', null); }
        if (select) { $flag('pet', select); }
        masterService.descriptionHandler.nextDescription(false)
      },
      disabled:false
    };
    //with input and select
    const furtherDescription:Description = {
      descriptionData: function () {
      return `There is \\input{"default":"${$flag('petshout')||''}","placeholder":"nothing"}\\ to do. Except to select \\select["cat","dog"]\\ but does nothing` +
        `${($flag('pet'))?`\n\nOMG there is a ${$flag('pet')}`:``}` +
        `${($flag('pet')&&$flag('petshout'))?` 'it's saying ${$flag('petshout')}'`:``}`
    },options: [nextOptionInputs],fixed_options:[null,null,null,null,null]}
    const roomOptions = [
      {
        text:'option1',
        action:function () {
          masterService.descriptionHandler.headDescription(furtherDescription, 'map');
          masterService.descriptionHandler.setDescription(false);
        },
        disabled:false
      },
      {
        text:'save',
        action:()=>{masterService.gameSaver.save("save1");},
        disabled:false
      },
      {
        text:'option3',
        action:()=>{},
        disabled:true
      },
      {
        text:'unlock 3',
        action:()=>{
          let index = 0;
          let option = roomOptions[index];
          while (option.text !== "option3" && index < roomOptions.length)
            option = roomOptions[++index];
          if (index < roomOptions.length) {
            if (option.disabled) {
              option.disabled = false;
              this.text = "lock 3";
              return;
            }
            option.disabled = true;
            this.text = "unlock 3";
          }
        },
        disabled:false
      },
      {
        text:'add 1 hour',
        action:()=>{masterService.timeHandler.addTime("1h")},
        disabled:false
      },
      (roomName === 'room24') ?{
        text:'Map2',
        action:()=>{masterService.mapHandler.loadRoom("room25")},
        disabled:false
      }:null,
      {
        text:'add  20 exp',
        action:()=>{masterService.partyHandler.user.gain_experience(20);},
        disabled:false
      },
      {
        text:'debug quest',
        action:()=>{
          const quest = QuestFactory(masterService,{
            Factory: 'Quest',
            type: "DefeatEnemyQuest",
            enemies_defeated: 0
          })
          console.log("before:",masterService.QuestHolder)
          masterService.QuestHolder.add(quest)
          console.log("after:",masterService.QuestHolder)
        },
        disabled:false
      },
      null,
      {
        text:'add 1 month',
        action:()=>{masterService.timeHandler.addTime("1M")},
        disabled:false
      },
      {
        text:'add 100 gold',
        action:()=>{masterService.partyHandler.user.gold += 100},
        disabled:false
      },
    ]
    if ($flag("caninroom1")) {
      roomOptions.splice(2, 0, {
          text:'kick can',
          action:()=>{
            masterService.descriptionHandler.headDescription(kickCanDescription, 'map');
          masterService.descriptionHandler.setDescription();
          $flag("caninroom1", false);
          roomOptions.splice(2, 1);
          },
          disabled:false
        }
      )
    }
    if (roomName === 'room20') {
      const flyDescription1: Description = {
        descriptionData: function () {
          return `AAAAAAAAh`
        },
        options: [nextoption],
        fixed_options: [null, null, null, null, null]
      }
      const flyDescription2: Description = {
        descriptionData: function () {
          return `I can see the place where I started`
        },
        options: [nextoption],
        fixed_options: [null, null, null, null, null]
      }
      const flyDescription3: Description = {
        descriptionData: function () {
          return `That was something`
        },
        options: [nextoption],
        fixed_options: [null, null, null, null, null]
      }
      const cannonDescription:Description = {
        descriptionData: function () {
        return `Dafuk there is a cannon here.\n enter the cannon?`;
        }, options: [yesOption(() => {
          masterService.descriptionHandler.nextDescription();
          masterService.descriptionHandler.tailDescription([flyDescription1, flyDescription2, flyDescription3], 'map');
          masterService.mapHandler.loadRoom('room1');
          masterService.timeHandler.addTime('30m');
        }), noOption], fixed_options: [null, null, null, null, null]
        }
      roomOptions.splice(2, 0, {
        text:'Cannon',
        action:()=>{
          masterService.descriptionHandler.headDescription(cannonDescription, 'map');
          masterService.descriptionHandler.setDescription();
        },
        disabled:false
      })
    }
    const fistEnter:Description = {descriptionData: function () {
      return `It's the first time`
    }, options:[nextoption],fixed_options: [null, null, null, null, null]};
    const roomDescription:Description = {
      descriptionData: function () {
      return `I look at the${(roomName!=='room1')?' same':''} room ${$flag("map1room1firstenter")?"FOR THE VERY FIRST TIME":"AGAIN."}${(roomName!=='room1')?`\nbut it's room '${roomName}'`:''}`
    }, options:roomOptions,fixed_options:[null,null,null,null,null]}
    roomDescription.fixed_options[0] = DescriptionSelectItemFromMap(masterService)
    roomDescription.fixed_options[1] = {
      text:'info',
      action:()=>{masterService.InfoPageToggler.toggle()},
      disabled:false
    }
    const firstExit:Description = {descriptionData:function () {
      return `It was the first time`
    }, options:[nextoption],fixed_options:[null,null,null,null,null]};
    const kickCanDescription:Description = {descriptionData:function () {
      return `You kick the can, it's fun.
  The can flew awa}`
    }, options:[nextoption],fixed_options:[null,null,null,null,null]};

    const room = fill_room({
      onEnter: () => {
        if ($flag("map1room1firstenter")) {
          masterService.descriptionHandler.tailDescription(fistEnter, 'map');
        }
        masterService.descriptionHandler.tailDescription(roomDescription, 'map')
        masterService.descriptionHandler.nextDescription();
        if (randomCheck(10)) {
          new Battle(masterService, new testformation(masterService),
          function (battle_options:battle_options)
          {
            const options=[
              battle_options[0],
              battle_options[3],
              battle_options[7],
              battle_options[13],,
            ]
            battle_options.splice(0,battle_options.length,...options)
          }
          ).startRound()
        }
      },
      onExit: () => {
        if ($flag("map1room1firstexit")) {
          $flag("map1room1firstenter", false)
          $flag("map1room1firstexit", false);
          masterService.descriptionHandler.tailDescription(firstExit, 'map');
        }
      },
      beforeMoveTo(roomName) {
        return true;
      },
      afterMoveTo(roomName) {
        if (roomName !== 'room1') {
          masterService.timeHandler.addTime('5m')
        }
      },
      icon: ""
    })
    return room;
  }
}
