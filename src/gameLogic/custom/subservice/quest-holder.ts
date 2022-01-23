import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { storeable, StoreableType} from "src/gameLogic/core/Factory/Factory";
import { GameSaver } from "src/gameLogic/core/subservice/game-saver";
import { Quest } from "../Class/Quest/Quest";
import { QuestFactory } from "../Factory/QuestFactory";
import { ObjectSet } from "../ClassHelper/ObjectSet";

export class QuestHolder implements storeable
{
  type:"QuestHolder"="QuestHolder";
  private active_quest=new ObjectSet<Quest>();
  private readonly master_service: MasterService;
  constructor(game_saver:GameSaver,master_service:MasterService)
  {
    this.master_service = master_service;
    game_saver.register("QuestHolder",this)
  }
  add(quest:Quest){this.active_quest.push(quest)}

  toJson():QuestHolderOptions
  {
    const options:QuestHolderOptions = {
      Factory: "load_quests",
      type:"load_quest",
      quests:this.active_quest.map(quest=>quest.toJson()),
      dependency_gamesave_object_key:[]
    }
    options["dependency_gamesave_object_key"] = Array.from(
      options.quests.reduce((prev, curr)=>{
      if(curr.dependency_gamesave_object_key)
      for(const name of curr.dependency_gamesave_object_key)
        prev.add(name);
      return prev;
    },new Set<gamesavenames>()))
    return options;
  }
  fromJson(options:QuestHolderOptions)
  { for(const option of options.quests)this.add(QuestFactory(this.master_service, option)) }
}

type QuestHolderOptions = {
  Factory: "load_quests",
    type:"load_quest",
    quests:StoreableType[],
    dependency_gamesave_object_key:gamesavenames[]
}

export const loadQuest:FactoryFunction = (master_service:MasterService, options:QuestHolderOptions)=>{
  master_service.QuestHolder.fromJson(options)
}
