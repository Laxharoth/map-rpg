import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/classes/Character/Status/Status';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.css']
})
export class StatusIconComponent implements OnInit {

  @Input() status: Status;
  elRef: ElementRef;
  xOffset:number;
  constructor(elRef:ElementRef) { this.elRef=elRef;}

  ngOnInit(): void {
    const x = this.elRef.nativeElement.offsetLeft;
    const parentNode =this.elRef.nativeElement.parentNode
    const parentX = parentNode.offsetLeft;
    this.xOffset = parentX -x
  }

  ngAfterViewInit(): void {
  }

}
