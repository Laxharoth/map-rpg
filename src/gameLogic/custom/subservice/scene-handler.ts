import { Observable, Subject } from 'rxjs';
import { Scene } from 'src/gameLogic/custom/Class/Scene/Scene';
import { DoubleLinkedList, DoubleLinkedListNode } from 'src/gameLogic/custom/ClassHelper/DoubleLinkedList';
import { GameStateService } from './game-state';
import { game_state } from './game-state.type';
import { LockMapService } from './lock-map';

/**
 * Inserts and loads scenes to/from the appropriate scene list.
 *
 * @export
 * @class SceneHandlerService
 */
export class SceneHandlerService {
  /** * An object with the sceneLists */
  private _sceneList:{[key: string]:DoubleLinkedList<Scene>}={};
  private sceneTextHistory = new DoubleLinkedList<string>();
  private pivot:DoubleLinkedListNode<string>;
  /** * A subject to handle the current scene. */
  private sceneSubject = new Subject<Scene>();
  /** * A subject to affect only the text displayed but not the options. */
  private sceneTextSubject = new Subject<string>();
  private lockmap:LockMapService;
  private gameStateHandler:GameStateService;
  /** * Gets the current sceneList */
  private get sceneList():DoubleLinkedList<Scene>
  {return this._sceneList[this.currentGameState]}
  constructor(lockmap:LockMapService,gameStateHandler:GameStateService){
    this.lockmap = lockmap;
    this.gameStateHandler=gameStateHandler;
    this.addSceneListWithGameState('map');
    this._sceneList['map'].insertHead(null);
  }
  /**
   * Sets the current scene to the head of the current list.
   *
   * @param {boolean} [addToHistory=true] If should be inserted in the history list.
   * @return { SceneHandlerService } Itself The SceneHandlerService
   * @memberof SceneHandlerService
   */
  setScene(addToHistory:boolean=true):SceneHandlerService
  {
    //if the current scene list is empty pop the game state until finds a scenelist with elements.
    while(!this.sceneList || this.sceneList.length === 0){ this.gameStateHandler.popState(); }
    if(this.sceneList.length>1)this.lockmap.lockMap("scene-lock");
    else this.lockmap.unlockMap("scene-lock");

    if(addToHistory)
    {
      const history = this.sceneList.head.value.sceneData();
      if(typeof history === "string") this.sceneTextHistory.insertHead(history);
      this.pivot = this.sceneTextHistory.head;
    }
    this.sceneSubject.next(this.sceneList.head.value);
    this.sceneTextSubject.next(this.sceneList.head.value.sceneData());
    return this
  }
  /**
   * Inserts scenes at the start of a scene list.
   * Also sets the current game state.
   * @param {(Scene|Scene[])} scene The scene to insert
   * @param {game_state} gameState The game state the scene list is associated with.
   * @return { SceneHandlerService } Itself
   * @memberof SceneHandlerService
   */
  headScene(scene:Scene|Scene[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scene instanceof Array))scene = [scene]
    this.addSceneListWithGameState(gameState);
    this._sceneList[gameState].insertHead(...scene);
    return this
  }
  /**
   * Inserts scenes right after the fist scene of a scene list.
   * Also sets the current game state.
   * @param {(Scene|Scene[])} scene The scene to insert
   * @param {game_state} gameState The game state the scene list is associated with.
   * @return { SceneHandlerService } Itself
   * @memberof SceneHandlerService
   */
  afterHeadScene(scene:Scene|Scene[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scene instanceof Array))scene = [scene]
    this.addSceneListWithGameState(gameState);
    this._sceneList[gameState].insertBefore(1,...scene);
    return this
  }
  /**
   * Inserts scenes at the end of a scene list.
   * Also sets the current game state.
   * @param {(Scene|Scene[])} scene The scene to insert
   * @param {game_state} gameState The game state the scene list is associated with.
   * @return { SceneHandlerService } Itself
   * @memberof SceneHandlerService
   */
  tailScene(scene:Scene|Scene[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scene instanceof Array))scene = [scene]
    this.addSceneListWithGameState(gameState);
    this._sceneList[gameState].insertTail(...scene);
    return this
  }
  /**
   * Sest the current scene to the next scene in the current scene list.
   *
   * @param {boolean} [addToHistory=true]  If should be inserted in the history list.
   * @return { SceneHandlerService } Itself The SceneHandlerService
   * @memberof SceneHandlerService
   */
  nextScene(addToHistory:boolean=true):SceneHandlerService{
    this.sceneList?.removeAt(0);
    this.setScene(addToHistory);
    return this
  }
  /**
   * Returns an observable to observe the current scene.
   *
   * @return { Observable<Scene> }
   * @memberof SceneHandlerService
   */
  onSetScene():Observable<Scene>
  {
    return this.sceneSubject.asObservable();
  }
  /**
   *Returns an observable to observe the current scene text.
   *
   * @return { Observable<string> }
   * @memberof SceneHandlerService
   */
  onSetTextScene():Observable<string>
  {
    return this.sceneTextSubject.asObservable();
  }

  getPreviousScene():void
  {
    if(this.pivot.next  ) this.pivot = this.pivot.next;
    this.sceneTextSubject.next(this.pivot.value);
  }

  getFollowingScene():void
  {
    if(this.pivot.prev  ) this.pivot = this.pivot.prev;
    this.sceneTextSubject.next(this.pivot.value);
  }
  /**
   * Gets the current scene.
   *
   * @readonly
   * @type {Scene}
   * @memberof SceneHandlerService
   */
  get currentScene():Scene
  {
    return this.sceneList.head.value;
  }

  /**
   * Removes scenes from the current scene list.
   * Used to remove nested scenes.
   *
   * @param {number} sceneNumber
   * @return { SceneHandlerService } Itself
   * @memberof SceneHandlerService
   */
  flush(sceneNumber: number):SceneHandlerService
  {
    while(this.sceneList.length>sceneNumber+1)
    { this.sceneList.removeAt(0); }
    this.setScene(false);
    return this;
  }
  /**
   * Adds a new scene list with a key
   *
   * @private
   * @param {string} gameState
   * @memberof SceneHandlerService
   */
  private addSceneListWithGameState(gameState: string) {
    if(!this._sceneList[gameState])
      this._sceneList[gameState] = new DoubleLinkedList<Scene>();
  }
  private get currentGameState() { return this.gameStateHandler.gameState; }
}
