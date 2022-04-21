import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { storeable} from "src/gameLogic/core/Factory/Factory";
import { GameSaver } from "src/gameLogic/core/subservice/game-saver";
import { Quest, QuestOptions } from "../Class/Quest/Quest";
import { QuestFactory } from "../Factory/QuestFactory";
import { ObjectSet } from "../ClassHelper/ObjectSet";
import { questnames } from "../Class/Quest/Quest.type";

export class QuestHolder implements storeable{
  type:"QuestHolder"="QuestHolder";
  private activeQuest=new ObjectSet<Quest>();
  private readonly masterService: MasterService;
  constructor(game_saver:GameSaver,master_service:MasterService){
    this.masterService = master_service;
    game_saver.register("QuestHolder",this)
  }
  add(quest:Quest){this.activeQuest.push(quest)}
  get(type:questnames){return this.activeQuest.find(quest=>quest.type===type);}
  toJson():QuestHolderOptions{
    const options:QuestHolderOptions = {
      Factory: "load_quests",
      type:"load_quest",
      quests:this.activeQuest.map(quest=>quest.toJson()),
      dependencyGamesaveObjectKey:[]
    }
    options["dependencyGamesaveObjectKey"] = Array.from(
      options.quests.reduce((prev, curr)=>{
      if(curr.dependency_gamesave_object_key)
      for(const name of curr.dependency_gamesave_object_key)
        prev.add(name);
      return prev;
    },new Set<gamesavenames>()))
    return options;
  }
  fromJson(options:QuestHolderOptions)
  { for(const option of options.quests)this.add(QuestFactory(this.masterService, option)) }
}

type QuestHolderOptions = {
  Factory: "load_quests",
    type:"load_quest",
    quests:QuestOptions[],
    dependencyGamesaveObjectKey:gamesavenames[]
}

export const loadQuest:FactoryFunction<void,QuestHolderOptions> = (master_service, options)=>{
  master_service.QuestHolder.fromJson(options)
}
