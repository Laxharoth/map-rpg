import { Description } from './../classes/Description';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DoubleLinkedList, DoubleLinkedListNode } from './../classes/DoubleLinkedList';
import { LockMapService } from './lock-map.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptionHandlerService {

  private descriptionList = new DoubleLinkedList<Description>();
  private descriptionTextHistory = new DoubleLinkedList<string>();
  private pivot:DoubleLinkedListNode<string>;
  private descriptionSubject = new Subject<Description>();
  private descriptionTextSubject = new Subject<string>();
  private lockmap:LockMapService;

  constructor(lockmap:LockMapService){
    this.descriptionList.insertHead(null);
    this.lockmap = lockmap
  }

  setDescription(addToHistory:boolean=true):void{
    if(this.descriptionList.length>1)this.lockmap.lockMap("description-lock");
    else this.lockmap.unlockMap("description-lock");

    if(addToHistory)
    {
      this.descriptionTextHistory.insertHead(this.descriptionList.head.value.text());
      this.pivot = this.descriptionTextHistory.head;
    }
    this.descriptionSubject.next(this.descriptionList.head.value);
    this.descriptionTextSubject.next(this.descriptionList.head.value.text());
  }

  headDescription(...description:Description[]):void{
    this.descriptionList.insertHead(...description);
  }

  tailDescription(...description:Description[]):void{
    this.descriptionList.insertTail(...description);
  }

  nextDescription(addToHistory:boolean=true):void{
    if(this.descriptionList.length > 1)
      this.descriptionList.removeAt(0);
    if(this.descriptionList.length > 0){
      this.setDescription(addToHistory);
    }
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
