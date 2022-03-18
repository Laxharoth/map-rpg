import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { FullCoreStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { Scene, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';

@Component({
  selector: 'app-stat-up-gui',
  templateUrl: './stat-up-gui.component.html',
  styleUrls: ['./stat-up-gui.component.css']
})
export class StatUpGuiComponent implements OnInit {
  character!: Character;
  core_stats!:FullCoreStats;
  max_core_stats!:FullCoreStats;
  upgrade_points!:number;
  private get_character_subsciption:Subscription;

  constructor(private masterService:MasterService) {
    this.get_character_subsciption = this.masterService.sceneHandler.onSetScene().subscribe((scene) => {
      this.initialize_description(scene)
    })
    // @ts-ignore
    this.initialize_description(masterService.sceneHandler.currentScene)
    masterService.sceneHandler.setScene(false);
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.get_character_subsciption && this.get_character_subsciption.unsubscribe();
  }
  private _option_select!:SceneOptions;
  get option_select():SceneOptions
  {
    if(!this._option_select)this._option_select = {
      text:'select',
      action:()=>{
        this.character.core_stats = {...this.core_stats}
        this.character.level_stats.upgrade_point  = this.upgrade_points;
        this.character.calculateStats();
        this.masterService.sceneHandler.nextScene(false);
      },
      get disabled(){return false}
    }
    return this._option_select;
  }
  private _option_skip!:SceneOptions;
  get option_skip():SceneOptions{
    if(!this._option_skip)this._option_skip = nextOption(this.masterService,'skip');
    return this._option_skip;
  }
  private _option_reset!:SceneOptions
  get option_reset():SceneOptions{
    if(!this._option_reset)this._option_reset = {text:'reset',action:()=>{
      this.core_stats = {...this.character.core_stats}
      this.upgrade_points  = this.character.level_stats.upgrade_point;
    },disabled:false}
    return this._option_reset;
  }
  private initialize_description(description:Scene){
    const character = description.sceneData();
    if(!(character instanceof Character))return;
    if(character.level_stats.upgrade_point===0) { this.masterService.sceneHandler.nextScene(false); return; }
    this.character = character;
    this.core_stats = {...character.core_stats}
    this.max_core_stats = character.battle_class.max_core_at_level(character.level_stats.level);
    this.upgrade_points = character.level_stats.upgrade_point;
    const fixed_options = description.fixed_options;
    if(fixed_options){
      fixed_options[0] = this.option_select;
      fixed_options[1] = this.option_reset;
      fixed_options[4] = this.option_skip;
    }
  }
  update_stat(value:number,stat:string){
    const new_stat = value;
    // @ts-ignore
    const difference = new_stat-this.core_stats[stat]
    // @ts-ignore
    this.core_stats[stat] = value;
    this.upgrade_points -=  difference;
  }
}
