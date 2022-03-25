import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { Quest, QuestOptions } from "../Class/Quest/Quest";

/** Creates an Quest with the */
export const QuestFactory:FactoryFunction<Quest,QuestOptions> = (master_service,options)=>{
  const quest = new quest_switcher[options.type](master_service);
  quest.fromJson(options);
  return quest;
}
export interface QuestConstructor{ new (master_service:MasterService):Quest }
export const quest_switcher:{[key: string]:QuestConstructor} = {}
