import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { game_state } from '../customTypes/states';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private gameStateSubject = new Subject<game_state>();
  private _gameStatePriority:game_state[] = ['map','item','battle'];
  private _gameState:game_state[] = [];
  private _gameStateIndex:number = 0;
  constructor() {this.gameState = this._gameStatePriority[0]; }

  set gameStatePriority(state:game_state[]){ this._gameStatePriority = state; }

  get gameState():game_state { return this._gameState[this._gameState.length - 1]; }
  set gameState(state:game_state)
  {
    const pushStateInPriority=()=>{
      this._gameState.push(this._gameStatePriority[this._gameStateIndex]);
      this._gameStateIndex++;
      this.gameStateSubject.next(this.gameState);
    }
    if(this._gameState.includes(state))return;
    while(this.gameState!==state){pushStateInPriority();}
  }
  popState()
  {
    this._gameState.pop();
    this._gameStateIndex--;
    this.gameStateSubject.next(this.gameState)
  }
  onSetGameState():Observable<game_state> {
    return this.gameStateSubject.asObservable();
  }
}
