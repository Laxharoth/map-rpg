import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Injectable({
  providedIn: 'root'
})
export class ShopCurrentItemService {
  private _currentItem: GameItem = null;
  private _currentItemSubject = new Subject<GameItem>();
  get currentItem():GameItem{return this._currentItem}
  set currentItem(item:GameItem){this._currentItem = item;this._currentItemSubject.next(this._currentItem)}
  constructor() { }

  onCurrentItemChanged():Observable<GameItem>
  {
    return this._currentItemSubject.asObservable();
  }
}
