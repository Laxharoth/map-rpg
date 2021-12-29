import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent implements OnInit {
  static _currentTab:tabs='user';
  get currentTab():tabs{return TabMenuComponent._currentTab};
  constructor() {}

  ngOnInit(): void {
  }

  setTab(tab:tabs,event:any):void { TabMenuComponent._currentTab = tab; }
}
type tabs ='user'|'party'|'equipment'|'perk';
