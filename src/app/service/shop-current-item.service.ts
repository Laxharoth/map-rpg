import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';

@Injectable({
  providedIn: 'root'
})
export class ShopCurrentItemService {
  private _currentItem: Item = null;
  private _currentItemSubject = new Subject<Item>();
  get currentItem():Item{return this._currentItem}
  set currentItem(item:Item){this._currentItem = item;this._currentItemSubject.next(this._currentItem)}
  constructor() { }

  onCurrentItemChanged():Observable<Item>
  {
    return this._currentItemSubject.asObservable();
  }
}
