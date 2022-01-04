import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { CoreStats } from 'src/gameLogic/custom/Class/Character/Character.type';
import { nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';

@Component({
  selector: 'app-stat-up-gui',
  templateUrl: './stat-up-gui.component.html',
  styleUrls: ['./stat-up-gui.component.css']
})
export class StatUpGuiComponent implements OnInit {
  character: Character;
  core_stats:CoreStats;
  max_core_stats:CoreStats;
  upgrade_points:number;
  private get_character_subsciption:Subscription;

  constructor(private masterService:MasterService) {
    this.get_character_subsciption = this.masterService.descriptionHandler.onSetDescription().subscribe((description) => {
      this.initialize_description(description)
    })
    this.initialize_description(masterService.descriptionHandler.currentDescription)
    masterService.descriptionHandler.setDescription(false);
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.get_character_subsciption && this.get_character_subsciption.unsubscribe();
  }
  private _option_select:DescriptionOptions;
  get option_select():DescriptionOptions
  {
    if(!this._option_select)this._option_select = new DescriptionOptions('select',()=>{
      this.character.core_stats = {...this.core_stats}
      this.character.level_stats.upgrade_point  = this.upgrade_points;
      this.character.calculateStats();
      this.masterService.descriptionHandler.nextDescription(false);
    },
    ()=>false)
    return this._option_select;
  }
  private _option_skip:DescriptionOptions;
  get option_skip():DescriptionOptions
  {
    if(!this._option_skip)this._option_skip = nextOption(this.masterService,'skip');
    return this._option_skip;
  }
  private _option_reset:DescriptionOptions
  get option_reset():DescriptionOptions
  {
    if(!this._option_reset)this._option_reset = new DescriptionOptions('reset',()=>{
      this.core_stats = {...this.character.core_stats}
      this.upgrade_points  = this.character.level_stats.upgrade_point;
    })
    return this._option_reset;
  }
  private initialize_description(description:Description)
  {
    const character = description.descriptionData();
    if(!(character instanceof Character))return;
    if(character.level_stats.upgrade_point===0) { this.masterService.descriptionHandler.nextDescription(false); return; }
    this.character = character;
    this.core_stats = {...character.core_stats}
    this.max_core_stats = character.battle_class.max_core_at_level(character.level_stats.level);
    this.upgrade_points = character.level_stats.upgrade_point;
    const fixed_options = description.fixed_options;
    fixed_options[0] = this.option_select;
    fixed_options[1] = this.option_reset;
    fixed_options[4] = this.option_skip;
  }
  update_stat(value:number,stat:string)
  {
    const new_stat = value;
    const difference = new_stat-this.core_stats[stat]
    this.core_stats[stat] = value;
    this.upgrade_points -=  difference;
  }
}
