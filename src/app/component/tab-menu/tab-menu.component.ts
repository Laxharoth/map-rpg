import { Component, Input, OnInit } from '@angular/core';
import { MasterService } from 'src/app/classes/masterService';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent implements OnInit {
  @Input() masterService:MasterService;
  currentTab:tabs='user';
  constructor() {}

  ngOnInit(): void {
  }

  setTab(tab:tabs,event:any):void { this.currentTab = tab; }
}
type tabs ='user'|'party'|'equipment'|'perk';
