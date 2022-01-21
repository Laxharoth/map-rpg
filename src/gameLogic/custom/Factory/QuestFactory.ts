import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { Quest, QuestOptions } from "../Class/Quest/Quest";

export const QuestFactory:FactoryFunction<Quest> = (master_service: MasterService,options:QuestOptions)=>
{
  const quest:Quest = new quest_switcher[options.type](master_service);
  quest.fromJson(options);
  return quest as Quest;
}
export interface QuestConstructor{ new (master_service:MasterService):Quest }
export const quest_switcher:{[key: string]:QuestConstructor} = {}
