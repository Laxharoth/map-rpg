import { MasterService } from "src/app/service/master.service";
import { default_flags } from "./configurable/subservice/flag-handler.type";
import { Factory } from "./core/Factory/Factory";
import { MainCharacter } from "./custom/Class/Character/MainCharacter/MainCharacter";
import { ItemFactory } from "./custom/Factory/ItemFactory";
import { FactWeb } from "./custom/subservice/fact-web";
import { InfoPageToggler } from "./custom/subservice/info-page-toggler";
import { LockMapService } from "./custom/subservice/lock-map";
import { MapHandlerService } from "./custom/subservice/map-handler";
import { PartyService } from "./custom/subservice/party";
import { QuestHolder } from "./custom/subservice/quest-holder";
import { SceneHandlerService } from "./custom/subservice/scene-handler";
import { TimeHandler } from "./custom/subservice/time-handler";
import { UniqueCharacterHandler } from "./custom/subservice/unique-character-handler";

export function entryPoint(masterService:MasterService){
  // Initialize custom services
  const { gameSaver, gameStateHandler } = masterService;
  const lockmap      = new LockMapService();
  const mapHandler   = new MapHandlerService(masterService,gameStateHandler,lockmap);
  const sceneHandler = new SceneHandlerService(lockmap, gameStateHandler);
  const timeHandler = new TimeHandler(gameSaver)
  const unique_characters_handler = new UniqueCharacterHandler(gameSaver);
  const partyHandler = new PartyService(gameSaver,unique_characters_handler);
  const data_web = new FactWeb(timeHandler, gameSaver,unique_characters_handler);
  const info_page_toggler = new InfoPageToggler(sceneHandler);
  const quest_holder = new QuestHolder(gameSaver,masterService);
  masterService.register("lockmap", lockmap);
  masterService.register("partyHandler", partyHandler);
  masterService.register("sceneHandler", sceneHandler);
  masterService.register("mapHandler", mapHandler);
  masterService.register("timeHandler",timeHandler);
  masterService.register("FactWeb",data_web);
  masterService.register("UniqueCharacterHandler",unique_characters_handler);
  masterService.register("InfoPageToggler",info_page_toggler);
  masterService.register("QuestHolder",quest_holder);

  masterService.sceneHandler.headScene({ options:[],sceneData:()=>null },'front-page');
}

export function newGame(masterService:MasterService){
  const user = new MainCharacter(masterService, 'player',"TestMainCharacterBattleClass");
  const meleeTest1 = ItemFactory(masterService,{ Factory:"Item",type:"MeleeTest"})
  const rangedTest1 = ItemFactory(masterService,{ Factory:"Item",type:"RangedTest"})
  const shieldTest1 = ItemFactory(masterService,{ Factory:"Item",type:"ShieldTest"})
  const armorTest1 = ItemFactory(masterService,{ Factory:"Item",type:"ArmorTest"})
  user.inventory.addItem(meleeTest1); user.inventory.addItem(rangedTest1); user.inventory.addItem(shieldTest1); user.inventory.addItem(armorTest1);
  masterService.partyHandler.user = user;
  masterService.partyHandler.setPartyMember(Factory(masterService,{
    Factory:"Character",
    type:"test character",
    name:"ally 1",
  }),0);
  masterService.flagsHandler.setFlags(default_flags)
  masterService.sceneHandler.clear();
  masterService.mapHandler.loadRoom(default_flags.currentroom);
}

export function continueGame(masterService:MasterService){
  // debug to get savedata
  masterService.gameSaver.load("save1");
  masterService.sceneHandler.clear();
  masterService.partyHandler.user = masterService.gameSaver.MainCharacter[0];
  masterService.mapHandler.loadRoom(masterService.flagsHandler.getFlag("currentroom"));
  masterService.timeHandler.addTime(0);
}
