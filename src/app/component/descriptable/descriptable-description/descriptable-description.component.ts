import { Component, Input, OnInit } from '@angular/core';
import { Descriptable } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';

@Component({
  selector: 'app-descriptable-description',
  templateUrl: './descriptable-description.component.html',
  styleUrls: ['./descriptable-description.component.css']
})
export class DescriptableDescriptionComponent implements OnInit {
  @Input() descriptable!:Descriptable;
  @Input() small:boolean=true;

  ngOnInit(): void {
    return undefined;
  }
}
