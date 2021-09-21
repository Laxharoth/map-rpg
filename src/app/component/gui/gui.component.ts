import { GameStateService } from './../../service/game-state.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DescriptionOptions } from 'src/app/classes/Descriptions/Description';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/classes/masterService';
import { charTest } from 'src/app/classes/Character/NPC/characterTest';
import { game_state } from 'src/app/customTypes/states';
import { Character } from 'src/app/classes/Character/Character';
import { MeleeTest } from 'src/app/classes/Equipment/Weapon/Melee/MeleeTest';
import { RangedTest } from 'src/app/classes/Equipment/Weapon/Ranged/RangedTest';
import { ShieldTest } from 'src/app/classes/Equipment/Shield/ShieldTest';
import { ArmorTest } from 'src/app/classes/Equipment/Armor/ArmorTest';
import { PerkUpgradeable } from 'src/app/classes/Perk/PerkUpgradeable';

@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  masterService:MasterService;
  currentOptions:Array<DescriptionOptions|null>;
  currentGameState:game_state;

  private descriptionOptions:Array<DescriptionOptions|null>;
  private offset = 0;
  private size   = 8;

  private descriptionSubscription : Subscription;
  private gameStateSubscription : Subscription;

  constructor() {
    this.masterService = new MasterService()
    //debug to get savedata
    this.masterService.flagsHandler.load("save1",this.masterService);
    this.FirstTimeUserInitialize();
    //debug to test having a team member
    this.masterService.partyHandler.setPartyMember(new charTest(this.masterService,'ally 1'),0)
    this.currentGameState = this.masterService.gameStateHandler.gameState;
    this.InitializeSubscriptions();

    this.masterService.mapHandler.loadRoom(this.masterService.flagsHandler.getFlag("currentroom"));
    this.masterService.flagsHandler.addTime(0);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe();
    this.gameStateSubscription.unsubscribe();
  }

  move(direction:any)
  {
    this.masterService.mapHandler.moveInsideMap(direction);
  }
  @HostListener('body:keydown',["$event"])
  mapmove(event: any): void
  {
    if(event.target.tagName.toLowerCase()==='input')return;
    const isnumber = (string: string) => ['1', '2', '3', '4', '5', '6','7', '8', '9', '0'].includes(string)?string:'';
    switch(event.key){
      case 'w':case 'ArrowUp' :this.move("UP");break;
      case 'a':case 'ArrowLeft' :this.move("LEFT");break;
      case 's':case 'ArrowDown' :this.move("DOWN");break;
      case 'd':case 'ArrowRight':this.move("RIGHT");break;
      case ' ':case 'Enter':this.currentOptions?.[0].action();break;
      default:
        if(isnumber(event.key)){
          let number = event.key==='0'? 10: parseInt(event.key)
          if(!isNaN(number)){
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

  isSubsetOfOptions():boolean{ return this.descriptionOptions.length>10; }

  isFirst():boolean{ return this.currentOptions?.[0] === this.descriptionOptions?.[0]; }

  isLast():boolean{
    let compareOptioinIndex = 0;
    while(this.currentOptions?.[compareOptioinIndex+1] !== null && compareOptioinIndex !=7)compareOptioinIndex++;
    return this.currentOptions?.[compareOptioinIndex]===this.descriptionOptions?.slice(-1)?.[0];
  }

  private setCurrentOptions()
  {
    this.currentOptions = this.descriptionOptions;
    if(this.descriptionOptions.length <= 10) return;
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
  })

  private nextOptions = new DescriptionOptions(">>>",()=>{
    if(this.isLast())return;
    this.offset+=this.size;
    this.setCurrentOptions();
  })

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
    if (!this.masterService.partyHandler.user) {
      const user = new charTest(this.masterService, 'player');
      const meleeTest1 = new MeleeTest(this.masterService);
      const rangedTest1 = new RangedTest(this.masterService);
      const shieldTest1 = new ShieldTest(this.masterService);
      const armorTest1 = new ArmorTest(this.masterService);
      user.addPerk(new PerkUpgradeable(this.masterService));
      user.addItem(meleeTest1); user.addItem(rangedTest1); user.addItem(shieldTest1); user.addItem(armorTest1);
      this.masterService.partyHandler.user = user;
    }
  }
}
