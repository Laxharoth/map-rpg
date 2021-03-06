import { Observable, Subject } from 'rxjs';
import { game_state, gameStatePriority } from 'src/gameLogic/configurable/subservice/game-state.type';

/**
 * Service that has the current game state.
 */
export class GameStateService {
  private gameStateSubject = new Subject<game_state>();
  private _gameStatePriority:game_state[] = gameStatePriority;
  private _gameState:game_state[] = [];
  private _gameStateIndex:number = 0;
  constructor() {this.gameState = this._gameStatePriority[0]; }

  /** Sets a new game state priority. */
  set gameStatePriority(state:game_state[]){
    this._gameStatePriority = state;this.gameState = this._gameStatePriority[0];
  }

  /** Gets the current game state. */
  get gameState():game_state { return this._gameState[this._gameState.length - 1]; }
  /** Sets the current state of the game. */
  set gameState(state:game_state){
    const pushStateInPriority=()=>{
      this._gameState.push(this._gameStatePriority[this._gameStateIndex]);
      this._gameStateIndex++;
    }
    if(this._gameState.includes(state))return;
    while(this.gameState!==state){pushStateInPriority();}
    this.gameStateSubject.next(this.gameState);
  }
  /** Returns to the previous game state acording to the game state priority. */
  popState()
  {
    this._gameState.pop();
    this._gameStateIndex--;
    this.gameStateSubject.next(this.gameState)
  }
  /** Returns a observable for when the game state changes. */
  onSetGameState():Observable<game_state> {
    return this.gameStateSubject.asObservable();
  }
}
