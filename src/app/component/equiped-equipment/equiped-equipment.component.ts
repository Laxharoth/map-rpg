import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';

@Component({
  selector: 'app-equiped-equipment',
  templateUrl: './equiped-equipment.component.html',
  styleUrls: ['./equiped-equipment.component.css']
})
export class EquipedEquipmentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }

}
