import { Component, Input, OnInit } from '@angular/core';
import { MasterService } from "src/app/service/master.service";

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
