import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';
import { compareArray } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-perk-up-item',
  templateUrl: './perk-up-item.component.html',
  styleUrls: ['./perk-up-item.component.css']
})
export class PerkUpItemComponent implements OnInit {
  @Input() selectedPath!:number[];
  @Input() fixedPath!:number[];
  @Input() depth!:number;
  @Input() optionIndex!:number;
  @Input() upgrade!:Upgrade;
  @Output() selectIndex= new EventEmitter<number>();
  constructor() { }
  ngOnInit(): void {
  }
  emit():void { this.selectIndex.emit(this.optionIndex) }
  get is_selected():boolean { return compareArray(this.selectedPath.slice(0,this.selectedPath.length-1).concat([this.optionIndex]),this.selectedPath) }
  get is_fixed():boolean    { return compareArray(this.selectedPath.slice(0,this.selectedPath.length-1).concat([this.optionIndex]),this.fixedPath) }
}
