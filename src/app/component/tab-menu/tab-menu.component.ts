import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent implements OnInit {
  currentTab:tabs='user';
  constructor() {}

  ngOnInit(): void {
  }

  setTab(tab:tabs,event:any):void { this.currentTab = tab; }
}
type tabs ='user'|'party'|'equipment'|'perk';
