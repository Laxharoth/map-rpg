import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { Quest, QuestOptions } from "../Class/Quest/Quest";

/** Creates an Quest with the */
export const QuestFactory:FactoryFunction<Quest,QuestOptions> = (masterService,options)=>{
  const quest = new questSwitcher[options.type](masterService);
  quest.fromJson(options);
  return quest;
}
export type QuestConstructor = new (masterService:MasterService) =>Quest
export const questSwitcher:{[key: string]:QuestConstructor} = {}
