import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';
import { tree_node } from 'src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';

@Component({
  selector: 'app-perk-up-row',
  templateUrl: './perk-up-row.component.html',
  styleUrls: ['./perk-up-row.component.css']
})
export class PerkUpRowComponent implements OnInit {
  @Input() selected_path:number[]=[];
  @Input() fixed_path:number[]=[];
  @Input() row:number=0;
  @Input() upgrades:tree_node<Upgrade>[]=[];
  constructor() { }
  @Output() selected_position_and_value= new EventEmitter<path_position_and_value>();
  ngOnInit(): void {
  }
  emit(option_index:number):void { this.selected_position_and_value.emit([this.row,option_index]) }
}
type path_position_and_value = [depth:number, option_index:number]
