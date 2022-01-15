import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { StoreableType } from "src/gameLogic/core/Factory/Factory";
import { descriptable } from "../GameElementDescription/GameElementDescription";
import { Quest, quest_description } from "./Quest";

export const QuestFactory:FactoryFunction<Quest&descriptable> = (master_service: MasterService,options:StoreableType)=>
{
  const quest:Quest = new quest_switcher[options.type](master_service);
  Object.defineProperty(quest, "description",{
    get :quest_description
  })
  quest.fromJson(options);
  return quest as Quest&descriptable;
}

/** @type {[key: string]:Quest.constructor} */
const quest_switcher:{[key: string]:any} = {}
export function register_quest(quest_module:quest_module)
{
  quest_module.register(quest_switcher)
  console.log(quest_switcher)
}

type quest_module = {
  register:(quest_switcher:{[key: string]:any})=>void;
}
