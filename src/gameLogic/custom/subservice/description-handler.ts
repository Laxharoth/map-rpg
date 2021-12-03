import { Observable, Subject } from 'rxjs';
import { Description } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { DoubleLinkedList, DoubleLinkedListNode } from 'src/gameLogic/custom/ClassHelper/DoubleLinkedList';
import { GameStateService } from './game-state';
import { game_state } from './game-state.type';
import { LockMapService } from './lock-map';

/**
 * Inserts and loads descriptions to/from the appropriate description list.
 *
 * @export
 * @class DescriptionHandlerService
 */
export class DescriptionHandlerService {
  /** * An object with the descriptionLists */
  private _descriptionList:{[key: string]:DoubleLinkedList<Description>}={};
  private descriptionTextHistory = new DoubleLinkedList<string>();
  private pivot:DoubleLinkedListNode<string>;
  /** * A subject to handle the current description. */
  private descriptionSubject = new Subject<Description>();
  /** * A subject to affect only the text displayed but not the options. */
  private descriptionTextSubject = new Subject<string>();
  private lockmap:LockMapService;
  private gameStateHandler:GameStateService;
  /** * Gets the current descriptionList */
  private get descriptionList():DoubleLinkedList<Description>
  {return this._descriptionList[this.currentGameState]}
  constructor(lockmap:LockMapService,gameStateHandler:GameStateService){
    this.lockmap = lockmap;
    this.gameStateHandler=gameStateHandler;
    this.addDescriptionListWithGameState('map');
    this._descriptionList['map'].insertHead(null);
  }
  /**
   * Sets the current description to the head of the current list.
   *
   * @param {boolean} [addToHistory=true] If should be inserted in the history list.
   * @return {*}  {DescriptionHandlerService} Itself The DescriptionHandlerService
   * @memberof DescriptionHandlerService
   */
  setDescription(addToHistory:boolean=true):DescriptionHandlerService
  {
    //if the current description list is empty pop the game state until finds a descriptionlist with elements.
    while(!this.descriptionList || this.descriptionList.length === 0){ this.gameStateHandler.popState(); }
    if(this.descriptionList.length>1)this.lockmap.lockMap("description-lock");
    else this.lockmap.unlockMap("description-lock");

    if(addToHistory)
    {
      const history = this.descriptionList.head.value.descriptionData();
      if(typeof history === "string") this.descriptionTextHistory.insertHead(history);
      this.pivot = this.descriptionTextHistory.head;
    }
    this.descriptionSubject.next(this.descriptionList.head.value);
    this.descriptionTextSubject.next(this.descriptionList.head.value.descriptionData());
    return this
  }
  /**
   * Inserts descriptions at the start of a description list.
   * Alto sets the current game state.
   * @param {(Description|Description[])} description The description to insert
   * @param {game_state} gameState The game state the description list is associated with.
   * @return {*}  {DescriptionHandlerService} Itself
   * @memberof DescriptionHandlerService
   */
  headDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertHead(...description);
    return this
  }
  /**
   * Inserts descriptions right after the fist description of a description list.
   * Alto sets the current game state.
   * @param {(Description|Description[])} description The description to insert
   * @param {game_state} gameState The game state the description list is associated with.
   * @return {*}  {DescriptionHandlerService} Itself
   * @memberof DescriptionHandlerService
   */
  afterHeadDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertBefore(1,...description);
    return this
  }
  /**
   * Inserts descriptions at the end of a description list.
   * Alto sets the current game state.
   * @param {(Description|Description[])} description The description to insert
   * @param {game_state} gameState The game state the description list is associated with.
   * @return {*}  {DescriptionHandlerService} Itself
   * @memberof DescriptionHandlerService
   */
  tailDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertTail(...description);
    return this
  }
  /**
   * Sest the current description to the next description in the current description list.
   *
   * @param {boolean} [addToHistory=true]  If should be inserted in the history list.
   * @return {*}  {DescriptionHandlerService} Itself The DescriptionHandlerService
   * @memberof DescriptionHandlerService
   */
  nextDescription(addToHistory:boolean=true):DescriptionHandlerService{
    this.descriptionList?.removeAt(0);
    this.setDescription(addToHistory);
    return this
  }
  /**
   * Returns an observable to observe the current description.
   *
   * @return {*}  {Observable<Description>}
   * @memberof DescriptionHandlerService
   */
  onSetDescription():Observable<Description>
  {
    return this.descriptionSubject.asObservable();
  }
  /**
   *Returns an observable to observe the current description text.
   *
   * @return {*}  {Observable<string>}
   * @memberof DescriptionHandlerService
   */
  onSetTextDescription():Observable<string>
  {
    return this.descriptionTextSubject.asObservable();
  }

  getPreviousDescription():void
  {
    if(this.pivot.next  ) this.pivot = this.pivot.next;
    this.descriptionTextSubject.next(this.pivot.value);
  }

  getFollowingDescription():void
  {
    if(this.pivot.prev  ) this.pivot = this.pivot.prev;
    this.descriptionTextSubject.next(this.pivot.value);
  }
  /**
   * Gets the current description.
   *
   * @readonly
   * @type {Description}
   * @memberof DescriptionHandlerService
   */
  get currentDescription():Description
  {
    return this.descriptionList.head.value;
  }

  /**
   * Removes descriptions from the current description list.
   * Used to remove nested descriptions.
   *
   * @param {number} descriptionNumber
   * @return {*}  {DescriptionHandlerService} Itself
   * @memberof DescriptionHandlerService
   */
  flush(descriptionNumber: number):DescriptionHandlerService
  {
    while(this.descriptionList.length>descriptionNumber+1)
    { this.descriptionList.removeAt(0); }
    this.setDescription(false);
    return this;
  }
  /**
   * Adds a new description list with a key
   *
   * @private
   * @param {string} gameState
   * @memberof DescriptionHandlerService
   */
  private addDescriptionListWithGameState(gameState: string) {
    if(!this._descriptionList[gameState])
      this._descriptionList[gameState] = new DoubleLinkedList<Description>();
  }
  private get currentGameState() { return this.gameStateHandler.gameState; }
}