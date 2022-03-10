import { InfoPageToggler } from 'src/gameLogic/custom/subservice/info-page-toggler';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { SceneHandlerService } from 'src/gameLogic/custom/subservice/scene-handler';
import { GameStateService } from 'src/gameLogic/core/subservice/game-state';
import { game_state } from 'src/gameLogic/configurable/subservice/game-state.type';
import { LockMapService } from 'src/gameLogic/custom/subservice/lock-map';
import { MapHandlerService } from 'src/gameLogic/custom/subservice/map-handler';
import { PartyService } from 'src/gameLogic/custom/subservice/party';
import { TimeHandler } from 'src/gameLogic/custom/subservice/time-handler';
import { FactWeb } from 'src/gameLogic/custom/subservice/fact-web';
import { UniqueCharacterHandler } from 'src/gameLogic/custom/subservice/unique-character-handler';
import { set_theme } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { load_files } from 'src/gameLogic/custom/functions/load_files';
import { QuestHolder } from 'src/gameLogic/custom/subservice/quest-holder';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { Factory } from 'src/gameLogic/core/Factory/Factory';

@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  currentGameState:game_state;

  private gameStateSubscription : Subscription;

  constructor(private masterService:MasterService) {
    set_theme()
    this.currentGameState = "prepare";
    this.register_master_service_subservice();
    this.InitializeSubscriptions();
    load_files({}).then(() => {
      //debug to get savedata
      this.masterService.gameSaver.load("save1");

      this.FirstTimeUserInitialize();

      this.masterService.mapHandler.loadRoom(this.masterService.flagsHandler.getFlag("currentroom"));
      this.masterService.timeHandler.addTime(0);
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.gameStateSubscription.unsubscribe();
  }
  private InitializeSubscriptions() {
    this.gameStateSubscription = this.masterService.gameStateHandler.onSetGameState().subscribe(gameState => {
      this.currentGameState = gameState;
    });
  }
  private register_master_service_subservice() {
    const gameSaver  = new GameSaver(this.masterService);
    const lockmap      = new LockMapService();
    const gameStateHandler   = new GameStateService();
    const mapHandler   = new MapHandlerService(this.masterService,gameStateHandler,lockmap);
    const sceneHandler = new SceneHandlerService(lockmap, gameStateHandler);
    const flagsHandler = new FlagHandlerService(gameSaver);
    const timeHandler = new TimeHandler(gameSaver)
    const unique_characters_handler = new UniqueCharacterHandler(gameSaver);
    const partyHandler = new PartyService(gameSaver,unique_characters_handler);
    const data_web = new FactWeb(timeHandler, gameSaver,unique_characters_handler);
    const info_page_toggler = new InfoPageToggler(sceneHandler);
    const quest_holder = new QuestHolder(gameSaver,this.masterService);
    this.masterService.register("lockmap", lockmap);
    this.masterService.register("flagsHandler", flagsHandler);
    this.masterService.register("partyHandler", partyHandler);
    this.masterService.register("gameStateHandler", gameStateHandler);
    this.masterService.register("sceneHandler", sceneHandler);
    this.masterService.register("mapHandler", mapHandler);
    this.masterService.register("gameSaver", gameSaver);
    this.masterService.register("timeHandler",timeHandler);
    this.masterService.register("FactWeb",data_web);
    this.masterService.register("UniqueCharacterHandler",unique_characters_handler);
    this.masterService.register("InfoPageToggler",info_page_toggler);
    this.masterService.register("QuestHolder",quest_holder);
  }
  private FirstTimeUserInitialize() {
    if(this.masterService.gameSaver?.MainCharacter?.[0]) {
      this.masterService.partyHandler.user = this.masterService.gameSaver.MainCharacter[0];
    }
    if (!this.masterService.partyHandler.user) {
      const user = new MainCharacter(this.masterService, 'player',"TestMainCharacterBattleClass");
      const meleeTest1 = ItemFactory(this.masterService,{ Factory:"Item",type:"MeleeTest"})
      const rangedTest1 = ItemFactory(this.masterService,{ Factory:"Item",type:"RangedTest"})
      const shieldTest1 = ItemFactory(this.masterService,{ Factory:"Item",type:"ShieldTest"})
      const armorTest1 = ItemFactory(this.masterService,{ Factory:"Item",type:"ArmorTest"})
      user.inventory.addItem(meleeTest1); user.inventory.addItem(rangedTest1); user.inventory.addItem(shieldTest1); user.inventory.addItem(armorTest1);
      this.masterService.partyHandler.user = user;
      this.masterService.partyHandler.setPartyMember(Factory(this.masterService,{
        Factory:"Character",
        type:"test character",
        name:"ally 1",
      }),0);
    }
  }
}
