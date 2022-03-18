import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Equipment } from 'src/gameLogic/custom/Class/Equipment/Equipment';

@Component({
  selector: 'app-equiped-equipment',
  templateUrl: './equiped-equipment.component.html',
  styleUrls: ['./equiped-equipment.component.css']
})
export class EquipedEquipmentComponent implements OnInit {
  @Input() equipment!:Equipment;
  @Output() equipment_emitter = new EventEmitter<Equipment>();
  constructor() {}
  ngOnInit(): void {}
  emit(){
    this.equipment_emitter.emit(this.equipment)
  }
}
