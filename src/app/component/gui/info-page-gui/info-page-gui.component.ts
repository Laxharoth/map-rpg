import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page-gui',
  templateUrl: './info-page-gui.component.html',
  styleUrls: ['./info-page-gui.component.css']
})
export class InfoPageGuiComponent implements OnInit {
  current_tab = 'A'
  constructor() { }

  ngOnInit(): void {
  }

  setTab(event:Event){
    if(!event.target){ return; }
    const tabTarget = (event.target as HTMLElement).getAttribute('for') ;
    if(tabTarget) this.current_tab = tabTarget ;
  }
}
