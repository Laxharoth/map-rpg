import { Component, HostListener, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';

@Component({
  selector: 'app-map-gui',
  templateUrl: './map-gui.component.html',
  styleUrls: ['./map-gui.component.css']
})
export class MapGuiComponent implements OnInit {

  constructor(private masterService:MasterService) { }

  ngOnInit(): void {
  }

  move(direction:any)
  {
    this.masterService.mapHandler.moveInsideMap(direction);
  }

  @HostListener('body:keydown',["$event"])
  mapmove(event: any): void
  {
    if(event.target.tagName.toLowerCase()==='input')return;
    switch(event.key){
      case 'w':case 'ArrowUp' :this.move("UP");break;
      case 'a':case 'ArrowLeft' :this.move("LEFT");break;
      case 's':case 'ArrowDown' :this.move("DOWN");break;
      case 'd':case 'ArrowRight':this.move("RIGHT");break;
    }
  }

}
