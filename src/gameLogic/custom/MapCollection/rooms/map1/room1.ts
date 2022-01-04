import { battle_options } from './../../../Class/Battle/Battle.type';
import { Battle } from './../../../Class/Battle/Battle';
import { DescriptionSelectItemFromMap, nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { MasterService } from "src/app/service/master.service";
import { flagname } from "src/gameLogic/configurable/subservice/flag-handler.type";
import { testformation } from "src/gameLogic/custom/Class/Character/NPC/EnemyFormations/testformation";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { Room, roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { getInputs, randomCheck } from "src/gameLogic/custom/functions/htmlHelper.functions";

export function room(roomName: string): roomFunction {
  return function (masterService: MasterService): Room {
    const $flag = (name: flagname, value: any = null) => {
      if (value !== null) masterService.flagsHandler.setFlag(name, value);
      return masterService.flagsHandler.getFlag(name)
    };
    const nextoption = nextOption(masterService)
    const yesOption = (action: () => void) => new DescriptionOptions("Yes", function () {
      action()
    });
    const noOption = new DescriptionOptions("No", function () {
      masterService.descriptionHandler.nextDescription()
    });
    const nextOptionInputs = new DescriptionOptions("next", function () {
      const {
        input,
        select
      } = getInputs();
      $flag('petshout', input);
      if (input === '') {
        $flag('petshout', null);
      }
      if (select) {
        $flag('pet', select);
      }
      masterService.descriptionHandler.nextDescription(false)
    });
    //with input and select
    const furtherDescription = new Description(function () {
      return `There is \\input{"default":"${$flag('petshout')||''}","placeholder":"nothing"}\\ to do. Except to select \\select["cat","dog"]\\ but does nothing` +
        //without input with select
        //const furtherDescription = new Description(function(){return `There is to do. Except to select \\select["cat","dog"]\\ but does nothing`+
        //with input without select
        //const furtherDescription = new Description(function(){return `There is \\input{"placeholder":"nothing"}\\ to do. Except to select but does nothing\n\n`+
        `${($flag('pet'))?`\n\nOMG there is a ${$flag('pet')}`:``}` +
        `${($flag('pet')&&$flag('petshout'))?` 'it's saying ${$flag('petshout')}'`:``}`
    }, [nextOptionInputs])
    const roomOptions = [
      new DescriptionOptions("option1", function () {
        masterService.descriptionHandler.headDescription(furtherDescription, 'map');
        masterService.descriptionHandler.setDescription(false);
      }),
      new DescriptionOptions("save", function () {
        masterService.gameSaver.save("save1");
      }),
      new DescriptionOptions("option3", function () {}, true),
      new DescriptionOptions("unlock 3", function () {
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
      }),
      new DescriptionOptions("add 1 hour", function () {
        masterService.timeHandler.addTime("1h")
      }),
      (roomName === 'room24') ? new DescriptionOptions("Map2", function () {
        masterService.mapHandler.loadRoom("room25")
      }) : null,
      new DescriptionOptions("add  20 exp",function () {
        masterService.partyHandler.user.gain_experience(20);
      }),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new DescriptionOptions("add 1 month", function () {
        masterService.timeHandler.addTime("1M")
      }),
      new DescriptionOptions("add 100 gold", function () {
        masterService.partyHandler.user.gold += 100
      }),
    ]
    if ($flag("caninroom1")) {
      roomOptions.splice(2, 0, new DescriptionOptions("kick can", function () {
        masterService.descriptionHandler.headDescription(kickCanDescription, 'map');
        masterService.descriptionHandler.setDescription();
        $flag("caninroom1", false);
        roomOptions.splice(2, 1);
      }))
    }
    if (roomName === 'room20') {
      const flyDescription1 = new Description(function () {
        return `AAAAAAAAh`
      }, [nextoption])
      const flyDescription2 = new Description(function () {
        return `I can see the place where I started`
      }, [nextoption])
      const flyDescription3 = new Description(function () {
        return `That was something`
      }, [nextoption])
      const cannonDescription = new Description(function () {
        return `Dafuk there is a cannon here.\n enter the cannon?`;
      }, [yesOption(() => {
        masterService.descriptionHandler.nextDescription();
        masterService.descriptionHandler.tailDescription([flyDescription1, flyDescription2, flyDescription3], 'map');
        masterService.mapHandler.loadRoom('room1');
        masterService.timeHandler.addTime('30m');
      }), noOption])
      roomOptions.splice(2, 0, new DescriptionOptions("Cannon", function () {
        masterService.descriptionHandler.headDescription(cannonDescription, 'map');
        masterService.descriptionHandler.setDescription();
      }))
    }
    const fistEnter = new Description(function () {
      return `It's the first time`
    }, [nextoption]);
    const roomDescription = new Description(function () {
      return `I look at the${(roomName!=='room1')?' same':''} room ${$flag("map1room1firstenter")?"FOR THE VERY FIRST TIME":"AGAIN."}${(roomName!=='room1')?`\nbut it's room '${roomName}'`:''}`
    }, roomOptions)
    roomDescription.fixed_options[0] = DescriptionSelectItemFromMap(masterService)
    roomDescription.fixed_options[1] = new DescriptionOptions('info',()=>masterService.InfoPageToggler.toggle());
    const firstExit = new Description(function () {
      return `It was the first time`
    }, [nextoption]);
    const kickCanDescription = new Description(function () {
      return `You kick the can, it's fun.
  The can flew away`
    }, [nextoption])

    const room = new Room({
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
