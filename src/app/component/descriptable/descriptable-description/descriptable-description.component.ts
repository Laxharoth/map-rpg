import { Component, Input, OnInit } from '@angular/core';
import { descriptable } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';

@Component({
  selector: 'app-descriptable-description',
  templateUrl: './descriptable-description.component.html',
  styleUrls: ['./descriptable-description.component.css']
})
export class DescriptableDescriptionComponent implements OnInit {
  @Input() descriptable!:descriptable;
  @Input() small:boolean=true;
  constructor() { }

  ngOnInit(): void {
  }

}
