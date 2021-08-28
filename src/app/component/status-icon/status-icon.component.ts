import { Component, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/classes/Character/Status/Status';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.css']
})
export class StatusIconComponent implements OnInit {

  @Input() status: Status;

  constructor() { }

  ngOnInit(): void {}

}
