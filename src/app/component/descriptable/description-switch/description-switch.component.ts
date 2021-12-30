import { Component, Input, OnInit } from '@angular/core';
import { GameElementDescriptionSection, section_names } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';

@Component({
  selector: 'app-description-switch',
  templateUrl: './description-switch.component.html',
  styleUrls: ['./description-switch.component.css']
})
export class DescriptionSwitchComponent implements OnInit {
  @Input() section:GameElementDescriptionSection;
  constructor() { }

  ngOnInit(): void { }
}
