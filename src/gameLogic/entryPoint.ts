import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';
import { MasterService } from "src/app/service/master.service";
import { default_flags } from "./configurable/subservice/flag-handler.type";
import { Factory } from "./core/Factory/Factory";
import { MainCharacter } from "./custom/Class/Character/MainCharacter/MainCharacter";
import { GameElementDescriptionSection } from "./custom/Class/GameElementDescription/GameElementDescription";
import { DescriptableSceneOptions, SceneOptions } from "./custom/Class/Scene/Scene";
import { CharacterFactory, characterType } from "./custom/Factory/CharacterFactory";
import { ItemFactory } from "./custom/Factory/ItemFactory";
import { removeItem } from "./custom/functions/htmlHelper.functions";
import { FactWeb } from "./custom/subservice/fact-web";
import { InfoPageToggler } from "./custom/subservice/info-page-toggler";
import { LockMapService } from "./custom/subservice/lock-map";
import { MapHandlerService } from "./custom/subservice/map-handler";
import { PartyService } from "./custom/subservice/party";
import { QuestHolder } from "./custom/subservice/quest-holder";
import { SceneHandlerService } from "./custom/subservice/scene-handler";
import { TimeHandler } from "./custom/subservice/time-handler";
import { UniqueCharacterHandler } from "./custom/subservice/unique-character-handler";
import { Int } from './custom/ClassHelper/Int';

export function entryPoint(masterService:MasterService){
  // Initialize custom services
  const { gameSaver, gameStateHandler } = masterService;
  const lockmap      = new LockMapService();
  const mapHandler   = new MapHandlerService(masterService,gameStateHandler,lockmap);
  const sceneHandler = new SceneHandlerService(lockmap, gameStateHandler);
  const timeHandler = new TimeHandler(gameSaver)
  const unique_characters_handler = new UniqueCharacterHandler(masterService);
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
  // const user = new MainCharacter(masterService, 'player',"TestMainCharacterBattleClass");
  // masterService.partyHandler.user = user;
  // const meleeTest1 = ItemFactory(masterService,{ Factory:"Item",type:"MeleeTest"})
  // const rangedTest1 = ItemFactory(masterService,{ Factory:"Item",type:"RangedTest"})
  // const shieldTest1 = ItemFactory(masterService,{ Factory:"Item",type:"ShieldTest"})
  // const armorTest1 = ItemFactory(masterService,{ Factory:"Item",type:"ArmorTest"})
  // user.inventory.addItem(meleeTest1); user.inventory.addItem(rangedTest1); user.inventory.addItem(shieldTest1); user.inventory.addItem(armorTest1);
  // masterService.partyHandler.user = user;
  // masterService.partyHandler.setPartyMember(Factory(masterService,{
    //   Factory:"Character",
    //   type:"test character",
    //   name:"ally 1",
    // }),0);
    //Create Seller
    // masterService.mapHandler.loadRoom(default_flags.currentroom);
    chooseScene(masterService);
}

export function continueGame(masterService:MasterService){
  // debug to get savedata
  // masterService.gameSaver.load("save1");
  // masterService.sceneHandler.clear();
  // masterService.partyHandler.user = masterService.gameSaver.MainCharacter[0];
  // masterService.mapHandler.loadRoom(masterService.flagsHandler.getFlag("currentroom"));
  // masterService.timeHandler.addTime(0);
  masterService.gameSaver.load("save2");
  masterService.sceneHandler.clear();
  masterService.partyHandler.user = masterService.gameSaver.MainCharacter[0];
  masterService.mapHandler.loadRoom(masterService.flagsHandler.getFlag("currentroom"));
  masterService.timeHandler.addTime(0);
}

function chooseScene(masterService: MasterService){
  const characters = [
    {
      name:'Frankie',
      type:'FrankiePeanuts',
      class:'Cleric',
    },
    {
      name:'Bishop',
      type:'BishopVault',
      class:'Monk',
    },
    {
      name:'Timber',
      type:'Timber',
      class:'Fighter,'
    }
]
  const options:DescriptableSceneOptions[] = characters.map(character => ({
    text:character.name,
    action(){ initializeMainCharacter(masterService, character , characters) }  ,
    descriptable:{
      get description(){
        return [
          {
            name: "name",
            section_items: [{
              name: "character name",
              value: character.name
            }]
          },
          {
            name: "description",
            section_items:[{
              name:"class",
              value:character.class
            }]
          }
        ] as GameElementDescriptionSection[];
      }
    },
    disabled:false
  }))
  masterService.sceneHandler.clear()
    .headScene({
      sceneData(){ return "select class";},
      options
      },"talk");
}

function initializeMainCharacter(masterService: MasterService,charactername:characterOption,options: characterOption[]){
  removeItem(options,charactername);
  masterService.partyHandler.user = CharacterFactory(masterService,{ Factory:"Character",type:charactername.type as characterType, "register-key":"MainCharacter"}) as UniqueCharacter;
  let index = 0;
  for(const allyOption of options){
    const ally = CharacterFactory(masterService,{ Factory:"Character",type:allyOption.type as characterType, "register-key":"PersistentCharacter"})
    masterService.partyHandler.setPartyMember(ally as UniqueCharacter,(index++) as 0|1);
  }
  masterService.flagsHandler.setFlags(default_flags)
  masterService.sceneHandler.clear();
  masterService.partyHandler.user.level_stats.upgrade_point = 3 as Int;
  masterService.mapHandler.loadRoom("entrance5");
  masterService.partyHandler.user.emit_stat_up();
}
interface characterOption{
  name:string,
  type:string,
  class:string,
}
