import { Description } from '../classes/Descriptions/Description';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DoubleLinkedList, DoubleLinkedListNode } from './../classes/DoubleLinkedList';
import { LockMapService } from './lock-map.service';
import { game_state } from '../customTypes/states';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptionHandlerService {
  private _descriptionList:{[key: string]:DoubleLinkedList<Description>}={};
  private descriptionTextHistory = new DoubleLinkedList<string>();
  private pivot:DoubleLinkedListNode<string>;
  private descriptionSubject = new Subject<Description>();
  private descriptionTextSubject = new Subject<string>();
  private lockmap:LockMapService;
  private gameStateHandler:GameStateService;
  private get descriptionList():DoubleLinkedList<Description>
  {return this._descriptionList[this.currentGameState]}
  constructor(lockmap:LockMapService,gameStateHandler:GameStateService){
    this.lockmap = lockmap;
    this.gameStateHandler=gameStateHandler;
    this.addDescriptionListWithGameState('map');
    this._descriptionList['map'].insertHead(null);
  }
  private addDescriptionListWithGameState(gameState: string) {
    if(!this._descriptionList[gameState])
      this._descriptionList[gameState] = new DoubleLinkedList<Description>();
  }

  private get currentGameState() { return this.gameStateHandler.gameState; }
  setDescription(addToHistory:boolean=true):DescriptionHandlerService
  {
    while(!this.descriptionList || this.descriptionList.length === 0){ this.gameStateHandler.popState(); }
    if(this.descriptionList.length>1)this.lockmap.lockMap("description-lock");
    else this.lockmap.unlockMap("description-lock");

    if(addToHistory)
    {
      this.descriptionTextHistory.insertHead(this.descriptionList.head.value.text());
      this.pivot = this.descriptionTextHistory.head;
    }
    this.descriptionSubject.next(this.descriptionList.head.value);
    this.descriptionTextSubject.next(this.descriptionList.head.value.text());
    return this
  }
  headDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertHead(...description);
    return this
  }

  afterHeadDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertBefore(1,...description);
    return this
  }

  tailDescription(description:Description|Description[],gameState:game_state):DescriptionHandlerService{
    this.gameStateHandler.gameState = gameState;
    if(description instanceof Description)description = [description]
    this.addDescriptionListWithGameState(gameState);
    this._descriptionList[gameState].insertTail(...description);
    return this
  }

  nextDescription(addToHistory:boolean=true):DescriptionHandlerService{
    this.descriptionList?.removeAt(0);
    this.setDescription(addToHistory);
    return this
  }

  onSetDescription():Observable<Description>
  {
    return this.descriptionSubject.asObservable();
  }

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

  get currentDescription():Description
  {
    return this.descriptionList.head.value;
  }

}
