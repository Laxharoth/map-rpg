import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { StoreableType } from "src/gameLogic/core/Factory/Factory";
import { descriptable } from "../GameElementDescription/GameElementDescription";
import { Quest, quest_descriptable_prototype } from "./Quest";

export const QuestFactory:FactoryFunction<Quest&descriptable> = (master_service: MasterService,options:StoreableType)=>
{
  const quest:Quest = new quest_switcher[options.type](master_service);
  quest.fromJson(options);
  return quest as Quest&descriptable;
}

/** @type {[key: string]:Quest.constructor} */
const quest_switcher:{[key: string]:any} = {}
export function register_quest(quest_module:quest_module)
{
  quest_module.register(quest_switcher,quest_descriptable_prototype.prototype)
  console.log(quest_switcher)
}

type quest_module = {
  register:(quest_switcher:{[key: string]:any},quest_descriptable_prototype:descriptable)=>void;
}
