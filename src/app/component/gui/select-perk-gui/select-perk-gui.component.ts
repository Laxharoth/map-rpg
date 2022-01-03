import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';
import { tree_node } from 'src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree';
import { nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';
import { compare_array } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-select-perk-gui',
  templateUrl: './select-perk-gui.component.html',
  styleUrls: ['./select-perk-gui.component.css']
})
export class SelectPerkGuiComponent implements OnInit {

  get fixed_path():number[]{return this.character.level_stats.upgrade_path};
  selected_path:number[]=[];
  private character: UniqueCharacter;
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

  upgrade_options(path: number[]):tree_node<Upgrade>[]
  {
    return this.character.upgrade_options(path);
  }

  update_selected_path([depth,index]:number[])
  {
    const new_selected_path = this.selected_path.slice(0,depth)
    new_selected_path.push(index)
    new_selected_path.push(null)
    this.selected_path = new_selected_path;
  }

  private _option_select:DescriptionOptions;
  get option_select():DescriptionOptions
  {
    if(!this._option_select)this._option_select = new DescriptionOptions('select',()=>{
      const new_selected = this.selected_path.slice(this.fixed_path.length,-1)
      for(const selected of new_selected)
      {
        this.character.upgrade(selected)
        if(this.character.level_stats.perk_point===0)break;
      }
      this.masterService.descriptionHandler.nextDescription(false);
    },
    ()=>!compare_array(this.fixed_path,this.selected_path.slice(0,this.fixed_path.length)))
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
      this.selected_path = [...this.fixed_path]
    })
    return this._option_reset;
  }
  private initialize_description(description:Description)
  {
    const character = description.descriptionData();
    if(!(character instanceof UniqueCharacter))return;
    if(character.level_stats.perk_point===0) { this.masterService.descriptionHandler.nextDescription(false); return; }
    this.character = character;
    this.selected_path = [...this.character.level_stats.upgrade_path,null]
    const fixed_options = description.fixed_options;
    fixed_options[0] = this.option_select;
    fixed_options[1] = this.option_reset;
    fixed_options[4] = this.option_skip;
  }
}