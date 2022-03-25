import { Observable, Subject } from 'rxjs';
import { FixedOptions, Scene as SceneInterface, SceneOptions, wrapAction } from 'src/gameLogic/custom/Class/Scene/Scene';
import { DoubleLinkedList, DoubleLinkedListNode } from 'src/gameLogic/custom/ClassHelper/DoubleLinkedList';
import { GameStateService } from '../../core/subservice/game-state';
import { game_state } from '../../configurable/subservice/game-state.type';
import { LockMapService } from './lock-map';

/** Inserts and loads scenes to/from the appropriate scene list. */
export class SceneHandlerService {
  /** * An object with the sceneLists */
  private _sceneList:{[key: string]:DoubleLinkedList<SceneInterface>}={};
  private sceneTextHistory = new DoubleLinkedList<string>();
  // private pivot:DoubleLinkedListNode<string>;
  /** * A subject to handle the current scene. */
  private sceneSubject = new Subject<Scene>();
  /** * A subject to affect only the text displayed but not the options. */
  private sceneTextSubject = new Subject<string>();
  private lockmap:LockMapService;
  private gameStateHandler:GameStateService;
  /** * Gets the current sceneList */
  private get sceneList():DoubleLinkedList<SceneInterface>{
    return this._sceneList[this.currentGameState]
  }
  constructor(lockmap:LockMapService,gameStateHandler:GameStateService){
    this.lockmap = lockmap;
    this.gameStateHandler=gameStateHandler;
    this.addSceneListWithGameState('map');
    // this._sceneList['map'].insertHead(null);
  }
  /** Sets the current scene to the head of the current list. */
  setScene(addToHistory:boolean=true):SceneHandlerService
  {
    //if the current scene list is empty pop the game state until finds a scenelist with elements.
    while(!this.sceneList || this.sceneList.length === 0){ this.gameStateHandler.popState(); }
    if(this.sceneList.length>1)this.lockmap.lockMap("scene-lock");
    else this.lockmap.unlockMap("scene-lock");
    const head = this.sceneList.head;
    if(!head){ console.error("No scenes in list"); return this;}
    if(addToHistory){
      const history = head.value.sceneData();
      if(typeof history === "string") this.sceneTextHistory.insertHead(history);
      // this.pivot = this.sceneTextHistory.head;
    }
    if(!head.value.fixed_options){
      head.value.fixed_options = [null, null, null, null, null];
    }
    for(const option of head.value.fixed_options.concat(head.value.options)){
      wrapAction(option)
    }
    this.sceneSubject.next(head.value as Scene);
    this.sceneTextSubject.next(head.value.sceneData());
    return this
  }
  /**
   * Inserts scenes at the start of a scene list.
   * Also sets the current game state.
   */
  headScene(scenes:SceneInterface|SceneInterface[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scenes instanceof Array))scenes = [scenes]
    this.addSceneListWithGameState(gameState);
    for(const scene of scenes){
      (!scene.fixed_options)&&(scene.fixed_options=[null,null,null,null,null,]);
    }
    this._sceneList[gameState].insertHead(...scenes as SceneInterface[]);
    return this
  }
  /**
   * Inserts scenes right after the fist scene of a scene list.
   * Also sets the current game state.
   */
  afterHeadScene(scenes:SceneInterface|SceneInterface[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scenes instanceof Array))scenes = [scenes]
    this.addSceneListWithGameState(gameState);
    for(const scene of scenes){
      (!scene.fixed_options)&&(scene.fixed_options=[null,null,null,null,null,]);
    }
    this._sceneList[gameState].insertBefore(1,...scenes as SceneInterface[]);
    return this
  }
  /**
   * Inserts scenes at the end of a scene list.
   * Also sets the current game state.
   */
  tailScene(scenes:SceneInterface|SceneInterface[],gameState:game_state):SceneHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(!(scenes instanceof Array))scenes = [scenes]
    this.addSceneListWithGameState(gameState);
    for(const scene of scenes){
      (!scene.fixed_options)&&(scene.fixed_options=[null,null,null,null,null,]);
    }
    this._sceneList[gameState].insertTail(...scenes as SceneInterface[]);
    return this
  }
  /**
   * Sets the current scene to the next scene in the current scene list.
   */
  nextScene(addToHistory:boolean=true):SceneHandlerService{
    if(Object.values(this._sceneList).reduce((acc,prev)=>acc+prev.length,0)>1){
      this.sceneList?.removeAt(0);
    }
    this.setScene(addToHistory);
    return this
  }
  /**
   * Returns an observable to observe the current scene.
   */
  onSetScene():Observable<SceneInterface>
  {
    return this.sceneSubject.asObservable();
  }
  /** Returns an observable to observe the current scene text. */
  onSetTextScene():Observable<string>
  {
    return this.sceneTextSubject.asObservable();
  }

  // getPreviousScene():void
  // {
  //   if(this.pivot.next  ) this.pivot = this.pivot.next;
  //   this.sceneTextSubject.next(this.pivot.value);
  // }

  // getFollowingScene():void
  // {
  //   if(this.pivot.prev  ) this.pivot = this.pivot.prev;
  //   this.sceneTextSubject.next(this.pivot.value);
  // }
  /** Gets the current scene. */
  get currentScene():SceneInterface|undefined{
    return this.sceneList.head?.value;
  }

  /**
   * Removes scenes from the current scene list.
   * Used to remove nested scenes.
   */
  flush(sceneNumber: number):SceneHandlerService
  {
    while(this.sceneList.length>sceneNumber+1)
    { this.sceneList.removeAt(0); }
    this.setScene(false);
    return this;
  }
  /** clears the scene list of the specified game_state or all if not specified */
  clear(game_state:game_state|null=null){
    for(const [,list] of Object.entries(this._sceneList).filter( ([name]) => game_state === null || game_state === name)){
      list.clear();
    }
    return this;
  }
  /** Adds a new scene list with a key */
  private addSceneListWithGameState(gameState: string) {
    if(!this._sceneList[gameState])
      this._sceneList[gameState] = new DoubleLinkedList<SceneInterface>();
  }
  private get currentGameState() { return this.gameStateHandler.gameState; }
}

/** A Representation of what the game will displayed (text and options)*/
interface Scene{
  sceneData:() => any;
  options: SceneOptions[];
  fixed_options: FixedOptions;
}
