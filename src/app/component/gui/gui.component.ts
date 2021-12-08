import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { MainCharacter } from 'src/gameLogic/custom/Class/Character/MainCharacter/MainCharacter';
import { charTest } from 'src/gameLogic/custom/Class/Character/NPC/characterTest';
import { DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { ArmorTest } from 'src/gameLogic/custom/Class/Equipment/Armor/ArmorTest';
import { ShieldTest } from 'src/gameLogic/custom/Class/Equipment/Shield/ShieldTest';
import { MeleeTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeTest';
import { RangedTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedTest';
import { PerkUpgradeable } from 'src/gameLogic/custom/Class/Perk/PerkUpgradeable';
import { MAXOPTIONSNUMBERPERPAGE } from 'src/gameLogic/custom/customTypes/constants';
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
  currentOptions:Array<DescriptionOptions|null>;
  currentGameState:game_state;

  private descriptionOptions:Array<DescriptionOptions|null>;
  private offset = 0;
  private size   = MAXOPTIONSNUMBERPERPAGE-2;

  private descriptionSubscription : Subscription;
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

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe();
    this.gameStateSubscription.unsubscribe();
  }

  @HostListener('body:keydown',["$event"])
  mapmove(event: any): void
  {
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case ' ':case 'Enter':this.currentOptions?.[0].action();break;
      default:
        if(isnumber(event.key)){
          let number = event.key==='0'? 10: parseInt(event.key)
          if(!isNaN(number) && !this.currentOptions?.[number-1]?.disabled){
            this.currentOptions?.[number-1]?.action();
          }
        }
        ;
    }
  }

  get enemyFormation():Character[]
  { return this.masterService.enemyHandler.enemyFormation.enemies }
  get party():Character[]
  {
    const party = [this.masterService.partyHandler.user].concat(this.masterService.partyHandler.party)
    return party;
  }

  isSubsetOfOptions():boolean{ return this.descriptionOptions.length>MAXOPTIONSNUMBERPERPAGE; }

  isFirst():boolean{ return this.currentOptions?.[0] === this.descriptionOptions?.[0]; }

  isLast():boolean{
    let compareOptioinIndex = 0;
    while(this.currentOptions?.[compareOptioinIndex+1] !== null && compareOptioinIndex !=7)compareOptioinIndex++;
    return this.currentOptions?.[compareOptioinIndex]===this.descriptionOptions?.slice(-1)?.[0];
  }

  private setCurrentOptions()
  {
    this.currentOptions = this.descriptionOptions;
    if(this.descriptionOptions.length <= MAXOPTIONSNUMBERPERPAGE) return;
    let aux_currentOptions = this.descriptionOptions.slice(this.offset,this.offset+this.size)
    while(aux_currentOptions.length< this.size) {aux_currentOptions.push(null);}
    aux_currentOptions.push(this.prevOptions);
    aux_currentOptions.push(this.nextOptions);

    this.currentOptions = aux_currentOptions;
  }

  private prevOptions = new DescriptionOptions("<<<",()=>{
    if(this.isFirst())return;
    this.offset-=this.size;
    this.setCurrentOptions();
  }, ()=>this.isFirst())

  private nextOptions = new DescriptionOptions(">>>",()=>{
    if(this.isLast())return;
    this.offset+=this.size;
    this.setCurrentOptions();
  },()=>this.isLast())

  private InitializeSubscriptions() {
    this.descriptionSubscription = this.masterService.descriptionHandler.onSetDescription().subscribe((description) => {
      this.offset = 0;
      this.descriptionOptions = description.options;
      this.setCurrentOptions();
    });
    this.gameStateSubscription = this.masterService.gameStateHandler.onSetGameState().subscribe(gameState => {
      this.currentGameState = gameState;
    });
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
