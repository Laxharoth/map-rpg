import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent implements OnInit {
  static _currentTab:tabs='user';
  player:Character;
  get currentTab():tabs{return TabMenuComponent._currentTab};
  constructor(private masterService:MasterService){
    this.player = masterService.partyHandler.user;
  }

  ngOnInit(): void {
  }

  setTab(tab:tabs,event:any):void { TabMenuComponent._currentTab = tab; }
}
type tabs ='user'|'party'|'equipment'|'perk';
