import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { game_state } from '../customTypes/states';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private gameStateSubject = new Subject<game_state>();
  private _gameState:game_state = 'map';

  constructor() { }

  set gameState(state:game_state){
    this._gameState = state;
    this.gameStateSubject.next(this._gameState);
  }

  get gameState():game_state { return this._gameState;}

  onSetGameState():Observable<game_state> {
    return this.gameStateSubject.asObservable();
  }
}
