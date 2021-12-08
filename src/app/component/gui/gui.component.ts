import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { charTest } from 'src/gameLogic/custom/Class/Character/NPC/characterTest';
import { ArmorTest } from 'src/gameLogic/custom/Class/Equipment/Armor/ArmorTest';
import { ShieldTest } from 'src/gameLogic/custom/Class/Equipment/Shield/ShieldTest';
import { MeleeTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeTest';
import { RangedTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedTest';
import { PerkUpgradeable } from 'src/gameLogic/custom/Class/Perk/PerkUpgradeable';
import { DescriptionHandlerService } from 'src/gameLogic/custom/subservice/description-handler';
import { EnemyFormationService } from 'src/gameLogic/custom/subservice/enemy-formation';
import { GameStateService } from 'src/gameLogic/custom/subservice/game-state';
import { game_state } from 'src/gameLogic/custom/subservice/game-state.type';
import { LockMapService } from 'src/gameLogic/custom/subservice/lock-map';
import { MapHandlerService } from 'src/gameLogic/custom/subservice/map-handler';
import { PartyService } from 'src/gameLogic/custom/subservice/party';
import { TimeHandler } from 'src/gameLogic/custom/subservice/time-handler';

@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  currentGameState:game_state;

  private gameStateSubscription : Subscription;

  constructor(private masterService:MasterService) {
    this.register_master_service_subservice();
    //debug to get savedata
    this.masterService.gameSaver.load("save1");

    this.FirstTimeUserInitialize();
    //debug to test having a team member
    this.currentGameState = this.masterService.gameStateHandler.gameState;
    this.InitializeSubscriptions();

    this.masterService.mapHandler.loadRoom(this.masterService.flagsHandler.getFlag("currentroom"));
    this.masterService.timeHandler.addTime(0);
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
    const enemyHandler  = new EnemyFormationService();
    const gameStateHandler   = new GameStateService();
    const mapHandler   = new MapHandlerService(this.masterService,gameStateHandler);
    const descriptionHandler = new DescriptionHandlerService(lockmap, gameStateHandler);
    const flagsHandler = new FlagHandlerService(gameSaver);
    const partyHandler = new PartyService(gameSaver);
    const timeHandler = new TimeHandler(flagsHandler)
    const updateCharacter=(character:Character)=>
    {
      if(character===this.masterService.partyHandler.user) return this.masterService.partyHandler.updateUser()

      for(let partyIndeX = 0; partyIndeX < this.masterService.partyHandler.party?.length; partyIndeX++)
      if(this.masterService.partyHandler.party[partyIndeX]===character)return this.masterService.partyHandler.updatePartyMember(partyIndeX)

      for(let enemyIndeX = 0; enemyIndeX < this.masterService.enemyHandler.enemyFormation?.enemies.length; enemyIndeX++)
      if(this.masterService.enemyHandler.enemyFormation.enemies[enemyIndeX]===character)return this.masterService.enemyHandler.updateEnemy(enemyIndeX)
    }
    this.masterService.register("lockmap", lockmap);
    this.masterService.register("flagsHandler", flagsHandler);
    this.masterService.register("partyHandler", partyHandler);
    this.masterService.register("enemyHandler", enemyHandler);
    this.masterService.register("gameStateHandler", gameStateHandler);
    this.masterService.register("descriptionHandler", descriptionHandler);
    this.masterService.register("mapHandler", mapHandler);
    this.masterService.register("gameSaver", gameSaver);
    this.masterService.register("updateCharacter",updateCharacter)
    this.masterService.register("timeHandler",timeHandler)
  }
  private FirstTimeUserInitialize() {
    if(this.masterService.gameSaver?.MainCharacter?.[0]) {
      this.masterService.partyHandler.user = this.masterService.gameSaver.MainCharacter[0];
    }
    if (!this.masterService.partyHandler.user) {
      const user = new MainCharacter({ hitpoints:200, energypoints:100, attack : 20, aim: 20, defence : 20, speed : 20, evasion : 20, }
                                      ,this.masterService, 'player');
      const meleeTest1 = new MeleeTest(this.masterService);
      const rangedTest1 = new RangedTest(this.masterService);
      const shieldTest1 = new ShieldTest(this.masterService);
      const armorTest1 = new ArmorTest(this.masterService);
      user.addPerk(new PerkUpgradeable(this.masterService));
      user.addItem(meleeTest1); user.addItem(rangedTest1); user.addItem(shieldTest1); user.addItem(armorTest1);
      this.masterService.partyHandler.user = user;
      this.masterService.partyHandler.setPartyMember(new charTest(this.masterService,'ally 1'),0)
    }
  }
}
