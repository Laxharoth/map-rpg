import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page-gui',
  templateUrl: './info-page-gui.component.html',
  styleUrls: ['./info-page-gui.component.css']
})
export class InfoPageGuiComponent implements OnInit {
  currentTab = 'A'
  ngOnInit(): void {
    return undefined;
  }

  setTab(event:Event){
    if(!event.target){ return; }
    const tabTarget = (event.target as HTMLElement).getAttribute('for') ;
    if(tabTarget) this.currentTab = tabTarget ;
  }
}
