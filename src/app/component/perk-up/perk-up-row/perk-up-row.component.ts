import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tree_node } from 'src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';

@Component({
  selector: 'app-perk-up-row',
  templateUrl: './perk-up-row.component.html',
  styleUrls: ['./perk-up-row.component.css']
})
export class PerkUpRowComponent implements OnInit {
  @Input() selectedPath:number[]=[];
  @Input() fixedPath:number[]=[];
  @Input() row:number=0;
  @Input() upgrades:tree_node<Upgrade>[]=[];
  constructor() { }
  @Output() selectedPositionAndValue= new EventEmitter<PathPositionAndValue>();
  ngOnInit(): void {
  }
  emit(optionIndex:Event):void { this.selectedPositionAndValue.emit([this.row,optionIndex as unknown as number]) }
}
type PathPositionAndValue = [depth:number, optionIndex:number]
