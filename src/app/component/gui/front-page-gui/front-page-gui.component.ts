import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/service/master.service';
import { SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { continueGame, newGame } from 'src/gameLogic/entryPoint';

@Component({
  selector: 'app-front-page-gui',
  templateUrl: './front-page-gui.component.html',
  styleUrls: ['./front-page-gui.component.css']
})
export class FrontPageGuiComponent implements OnInit {

  constructor(private masterService:MasterService) { }

  ngOnInit(): void {
    return undefined;
  }

  readonly newGame:SceneOptions = {
    text:"new game",
    action:()=>newGame(this.masterService),
    disabled:false
  }

  readonly continueGame:SceneOptions = {
    text:"continue",
    action:()=>continueGame(this.masterService),
    disabled:false
  }
}
