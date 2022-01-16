import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { descriptable } from "../GameElementDescription/GameElementDescription";
import { Quest, QuestOptions } from "./Quest";

export const QuestFactory:FactoryFunction<Quest> = (master_service: MasterService,options:QuestOptions)=>
{
  const quest:Quest = new quest_switcher[options.type](master_service);
  quest.fromJson(options);
  return quest as Quest;
}

interface QuestConstructor{
  new (master_service:MasterService):Quest
}
const quest_switcher:{[key: string]:QuestConstructor} = {}
export function register_quest(quest_module:quest_module)
{
  //@ts-ignore
  quest_module.register(quest_switcher,Quest)
}

type quest_module = {
  register:(quest_switcher:{[key: string]:any},Quest:QuestConstructor)=>void;
}
