import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { FullCoreStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { Scene, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { Int, roundToInt } from 'src/gameLogic/custom/ClassHelper/Int';

@Component({
  selector: 'app-stat-up-gui',
  templateUrl: './stat-up-gui.component.html',
  styleUrls: ['./stat-up-gui.component.css']
})
export class StatUpGuiComponent implements OnInit {
  character!: Character;
  coreStats!:FullCoreStats;
  maxCoreStats!:FullCoreStats;
  upgradePoints!:number;
  private getCharacterSubsciption:Subscription;

  constructor(private masterService:MasterService) {
    this.getCharacterSubsciption = this.masterService.sceneHandler.onSetScene().subscribe((scene) => {
      this.initializeDescription(scene);
    });
    if(!masterService.sceneHandler.currentScene){ return; }
    this.initializeDescription(masterService.sceneHandler.currentScene);
    masterService.sceneHandler.setScene(false);
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.getCharacterSubsciption && this.getCharacterSubsciption.unsubscribe();
  }
  private _optionSelect!:SceneOptions;
  get option_select():SceneOptions
  {
    if(!this._optionSelect)this._optionSelect = {
      text:'select',
      action:()=>{
        this.character.coreStats = {...this.coreStats}
        this.character.levelStats.upgradePoint  = roundToInt(this.upgradePoints);
        this.character.calculateStats();
        this.masterService.sceneHandler.nextScene(false);
      },
      get disabled(){return false}
    }
    return this._optionSelect;
  }
  private _optionSkip!:SceneOptions;
  get option_skip():SceneOptions{
    if(!this._optionSkip)this._optionSkip = nextOption(this.masterService,'skip');
    return this._optionSkip;
  }
  private _optionReset!:SceneOptions
  get option_reset():SceneOptions{
    if(!this._optionReset)this._optionReset = {text:'reset',action:()=>{
      this.coreStats = {...this.character.coreStats}
      this.upgradePoints  = this.character.levelStats.upgradePoint;
    },disabled:false}
    return this._optionReset;
  }
  private initializeDescription(description:Scene){
    const character = description.sceneData();
    if(!(character instanceof Character))return;
    if(character.levelStats.upgradePoint===0) { this.masterService.sceneHandler.nextScene(false); return; }
    this.character = character;
    this.coreStats = {...character.coreStats}
    this.maxCoreStats = character.battleClass.maxCoreAtLevel(character.levelStats.level);
    this.upgradePoints = character.levelStats.upgradePoint;
    const fixed_options = description.fixedOptions;
    if(fixed_options){
      fixed_options[0] = this.option_select;
      fixed_options[1] = this.option_reset;
      fixed_options[4] = this.option_skip;
    }
  }
  updateStat(value:number,stat:string){
    const characterCoreStats = this.coreStats as unknown as { [key: string]:Int };
    const new_stat = value;
    const difference = new_stat-characterCoreStats[stat];
    characterCoreStats[stat] = roundToInt(value);
    this.upgradePoints -=  difference;
  }
}
