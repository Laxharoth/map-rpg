import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from "src/app/service/master.service";
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { GameStateService } from 'src/gameLogic/core/subservice/game-state';
import { game_state } from 'src/gameLogic/configurable/subservice/game-state.type';
import { setTheme } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { load_files } from 'src/gameLogic/custom/functions/load_files';
import { entryPoint } from 'src/gameLogic/entryPoint';

@Component({
  selector   : 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls  :['./gui.component.css']
})
export class GuiComponent implements OnInit {
  currentGameState:game_state;
  private gameStateSubscription !: Subscription;

  constructor(private masterService:MasterService) {
    setTheme()
    this.currentGameState = "prepare";
    this.registerMasterServiceSubservice();
    this.InitializeSubscriptions();
    load_files({}).then(() => {
      entryPoint(masterService);
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.gameStateSubscription.unsubscribe();
  }
  private InitializeSubscriptions() {
    this.gameStateSubscription = this.masterService.gameStateHandler.onSetGameState().subscribe(gameState => {
      this.currentGameState = gameState;
    });
  }
  private registerMasterServiceSubservice() {
    const gameSaver  = new GameSaver(this.masterService);
    const flagsHandler = new FlagHandlerService(gameSaver);
    const gameStateHandler   = new GameStateService();
    this.masterService.register("gameSaver", gameSaver);
    this.masterService.register("flagsHandler", flagsHandler);
    this.masterService.register("gameStateHandler", gameStateHandler);
  }
}
