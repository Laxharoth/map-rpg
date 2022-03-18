import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';
import { compare_array } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-perk-up-item',
  templateUrl: './perk-up-item.component.html',
  styleUrls: ['./perk-up-item.component.css']
})
export class PerkUpItemComponent implements OnInit {
  @Input() selected_path!:number[];
  @Input() fixed_path!:number[];
  @Input() depth!:number;
  @Input() option_index!:number;
  @Input() upgrade!:Upgrade;
  @Output() select_index= new EventEmitter<number>();
  constructor() { }
  ngOnInit(): void {
  }
  emit():void { this.select_index.emit(this.option_index) }
  get is_selected():boolean { return compare_array(this.selected_path.slice(0,this.selected_path.length-1).concat([this.option_index]),this.selected_path) }
  get is_fixed():boolean    { return compare_array(this.selected_path.slice(0,this.selected_path.length-1).concat([this.option_index]),this.fixed_path) }
}
