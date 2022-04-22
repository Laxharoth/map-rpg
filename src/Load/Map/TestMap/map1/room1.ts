import { battleOptions } from '../../../../gameLogic/custom/Class/Battle/Battle.type';
import { Battle } from '../../../../gameLogic/custom/Class/Battle/Battle';
import { SceneSelectItemFromMap, nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { MasterService } from "src/app/service/master.service";
import { flagname } from "src/gameLogic/configurable/subservice/flag-handler.type";
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { Room, roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { getInputs, randomCheck } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { QuestFactory } from 'src/gameLogic/custom/Factory/QuestFactory';
import { Factory } from 'src/gameLogic/core/Factory/Factory';

export function room(roomName: string): roomFunction {
  return {
    roomname:roomName,
    disabled(masterService:MasterService){
      return roomName==="room12" ||
             (roomName==="room8" && masterService.flagsHandler.getFlag("firstreturn2room1"));
    },
    create(masterService: MasterService): Room {
      const $flag = (name: flagname, value: any = null) => {
        if (value !== null) masterService.flagsHandler.setFlag(name, value);
        return masterService.flagsHandler.getFlag(name)
      };
      const nextoption = nextOption(masterService)
      const yesOption = (action: ()=>void)=>{return {text:"Yes",action(){ action()},disabled: false }}
      const noOption = nextOption(masterService,"No")
      const nextOptionInputs = {
        text:"next",
        action() {
          const { input, select } = getInputs();
          $flag('petshout', input);
          if (input === '') { $flag('petshout', null); }
          if (select) { $flag('pet', select); }
          masterService.sceneHandler.nextScene(false)
        },
        disabled:false
      };
      // with input and select
      const furtherDescription:Scene = {
        sceneData () {
        return `There is \\input{"default":"${$flag('petshout')||''}","placeholder":"nothing"}\\ to do. Except to select \\select["cat","dog"]\\ but does nothing` +
          `${($flag('pet'))?`\n\nOMG there is a ${$flag('pet')}`:``}` +
          `${($flag('pet')&&$flag('petshout'))?` 'it's saying ${$flag('petshout')}'`:``}`
      },options: [nextOptionInputs],fixedOptions:[null,null,null,null,null]}
      const roomOptions:SceneOptions[] = [
        {
          text:'option1',
          action () {
            masterService.sceneHandler.headScene(furtherDescription, 'map');
            masterService.sceneHandler.setScene(false);
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
          action:()=>null,
          disabled:true
        },
        {
          text:'unlock 3',
          action:()=>{
            let index = 0;
            let option = roomOptions[index];
            while (option?.text !== "option3" && index < roomOptions.length)
              option = roomOptions[++index];
            if (index < roomOptions.length) {
              if (option?.disabled) {
                option.disabled = false;
                // @ts-ignore
                this.text = "lock 3";
                return;
              }
              if(option)
                option.disabled = true;
              // @ts-ignore
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
        // @ts-ignore
        (roomName === 'room24') ?{
          text:'Map2',
          action:()=>{masterService.mapHandler.loadRoom("room25")},
          disabled:false
        }:null,
        {
          text:'add  20 exp',
          action:()=>{masterService.partyHandler.user.gainExperience(20);},
          disabled:false
        },
        {
          text:'debug quest',
          action:()=>{
            const quest = QuestFactory(masterService,{
              Factory: 'Quest',
              type: "DefeatEnemyQuest",
              status:"in progress",
              enemies_defeated: 0
            })
            // tslint:disable-next-line: no-console
            console.log("before:",masterService.QuestHolder)
            masterService.QuestHolder.add(quest)
            // tslint:disable-next-line: no-console
            console.log("after:",masterService.QuestHolder)
          },
          disabled:false
        },
        // @ts-ignore
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
              masterService.sceneHandler.headScene(kickCanDescription, 'map');
            masterService.sceneHandler.setScene();
            $flag("caninroom1", false);
            roomOptions.splice(2, 1);
            },
            disabled:false
          }
        )
      }
      if (roomName === 'room20') {
        const flyDescription1: Scene = {
          sceneData () {
            return `AAAAAAAAh`
          },
          options: [nextoption],
          fixedOptions: [null, null, null, null, null]
        }
        const flyDescription2: Scene = {
          sceneData () {
            return `I can see the place where I started`
          },
          options: [nextoption],
          fixedOptions: [null, null, null, null, null]
        }
        const flyDescription3: Scene = {
          sceneData () {
            return `That was something`
          },
          options: [nextoption],
          fixedOptions: [null, null, null, null, null]
        }
        const cannonDescription:Scene = {
          sceneData () {
          return `Dafuk there is a cannon here.\n enter the cannon?`;
          }, options: [yesOption(() => {
            masterService.sceneHandler.nextScene();
            masterService.sceneHandler.tailScene([flyDescription1, flyDescription2, flyDescription3], 'map');
            masterService.mapHandler.loadRoom('room1');
            masterService.timeHandler.addTime('30m');
          }), noOption], fixedOptions: [null, null, null, null, null]
          }
        roomOptions.splice(2, 0, {
          text:'Cannon',
          action:()=>{
            masterService.sceneHandler.headScene(cannonDescription, 'map');
            masterService.sceneHandler.setScene();
          },
          disabled:false
        })
      }
      const fistEnter:Scene = {sceneData () {
        return `It's the first time`
      }, options:[nextoption],fixedOptions: [null, null, null, null, null]};
      const roomScene:Scene = {
        sceneData () {
        return `I look at the${(roomName!=='room1')?' same':''} room ${$flag("map1room1firstenter")?"FOR THE VERY FIRST TIME":"AGAIN."}${(roomName!=='room1')?`\nbut it's room '${roomName}'`:''}`
      }, options:roomOptions,fixedOptions:[
        SceneSelectItemFromMap(masterService),
        {
          text:'info',
          action:()=>{masterService.InfoPageToggler.toggle()},
          disabled:false
        },
        null,null,null
      ]}
      const firstExit:Scene = {sceneData () {
        return `It was the first time`
      }, options:[nextoption],fixedOptions:[null,null,null,null,null]};
      const kickCanDescription:Scene = {sceneData () {
        return `You kick the can, it's fun.
    The can flew awa}`
      }, options:[nextoption],fixedOptions:[null,null,null,null,null]};

      // tslint:disable-next-line: no-shadowed-variable
      const room = {
        onEnter: () => {
          if ($flag("map1room1firstenter")) {
            masterService.sceneHandler.tailScene(fistEnter, 'map');
          }
          masterService.sceneHandler.tailScene(roomScene, 'map')
          masterService.sceneHandler.nextScene();
          if (randomCheck(10)) {
            new Battle(masterService, Factory(masterService,{ Factory:"EnemyFormation",type:"testformation" }),
            // @ts-ignore
            (options: battleOptions) => {
                const newOptions = [
                  options[0],
                  options[3],
                  options[7],
                  options[13], ,
                ];
                // @ts-ignore
                options.splice(0, options.length, ...newOptions);
              }
            ).start()
          }
        },
        onExit: () => {
          if ($flag("map1room1firstexit")) {
            $flag("map1room1firstenter", false)
            $flag("map1room1firstexit", false);
            masterService.sceneHandler.tailScene(firstExit, 'map');
          }
        },
        beforeMoveTo(beforeMoveRoomName:string) {
          return true;
        },
        afterMoveTo(afterMoveRoomName:string) {
          if (afterMoveRoomName !== 'room1') {
            masterService.timeHandler.addTime('5m')
          }
        },
        icon: ""
      }
      return room;
    }
  }
}
