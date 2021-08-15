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
  private lockmap:LockMapService;

  constructor(lockmap:LockMapService){
    this.descriptionList.insertHead(null);
    this.lockmap = lockmap
  }

  setDescription():void{
    if(this.descriptionList.length>1)this.lockmap.lockMap("description-lock");
    else this.lockmap.unlockMap("description-lock");
    this.descriptionSubject.next(this.descriptionList.head.value);
    this.descriptionTextHistory.insertHead(this.descriptionList.head.value.text());
    this.pivot = this.descriptionTextHistory.head;
  }

  headDescription(...description:Description[]):void{
    this.descriptionList.insertHead(...description);
  }

  tailDescription(...description:Description[]):void{
    this.descriptionList.insertTail(...description);
  }

  nextDescription():void{
    if(this.descriptionList.length > 1)
      this.descriptionList.removeAt(0);
    if(this.descriptionList.length > 0){
      this.setDescription();
    }
  }

  onSetDescription():Observable<Description>
  {
    return this.descriptionSubject.asObservable();
  }

  getPreviousDescription():string
  {
    if(this.pivot.next  ) this.pivot = this.pivot.next;
    return this.pivot.value;
  }

  getFollowingDescription():string
  {
    if(this.pivot.prev  ) this.pivot = this.pivot.prev;
    return this.pivot.value;
  }
}
