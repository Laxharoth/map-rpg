import { Component, Input, OnInit } from '@angular/core';
import { DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';

@Component({
  selector: 'app-description-options',
  templateUrl: './description-options.component.html',
  styleUrls: ['./description-options.component.css']
})
export class DescriptionOptionsComponent implements OnInit {

  @Input() currentOptions:DescriptionOptions[];
  @Input() isSubsetOfOptions: boolean;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;


  constructor() { }

  ngOnInit(): void { }

}
