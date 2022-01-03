import { Observable, Subject } from 'rxjs';
import { game_state } from 'src/gameLogic/custom/subservice/game-state.type';

/**
 * Service that has the current game state.
 *
 * @export
 * @class GameStateService
 */
export class GameStateService {
  private gameStateSubject = new Subject<game_state>();
  private _gameStatePriority:game_state[] = ['map','item','excess-item','status','battle','shop','perk-tree','stat-up'];
  private _gameState:game_state[] = [];
  private _gameStateIndex:number = 0;
  constructor() {this.gameState = this._gameStatePriority[0]; }

  /**
   * Sets a new game state priority.
   *
   * @memberof GameStateService
   */
  set gameStatePriority(state:game_state[]){ this._gameStatePriority = state;this.gameState = this._gameStatePriority[0]; }

  /**
   * Gets the current game state.
   *
   * @type {game_state}
   * @memberof GameStateService
   */
  get gameState():game_state { return this._gameState[this._gameState.length - 1]; }
  /**
   * Sets the current state of the game.
   *
   * @memberof GameStateService
   */
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
  /**
   * Returns to the previous game state acording to the game state priority.
   *
   * @memberof GameStateService
   */
  popState()
  {
    this._gameState.pop();
    this._gameStateIndex--;
    this.gameStateSubject.next(this.gameState)
  }
  /**
   * Returns a observable for when the game state changes.
   *
   * @return {*}  {Observable<game_state>}
   * @memberof GameStateService
   */
  onSetGameState():Observable<game_state> {
    return this.gameStateSubject.asObservable();
  }
}
