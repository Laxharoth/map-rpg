import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Injectable({
  providedIn: 'root'
})
export class ShopCurrentItemService {
  private _currentItem: GameItem | null = null;
  private _currentItemSubject = new Subject<GameItem | null>();
  get currentItem():GameItem | null{return this._currentItem}
  set currentItem(item:GameItem | null){this._currentItem = item;this._currentItemSubject.next(this._currentItem)}
  constructor() {}
  onCurrentItemChanged():Observable<GameItem | null>{
    return this._currentItemSubject.asObservable();
  }
}
