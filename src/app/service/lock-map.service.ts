import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LockMapService {

  private lockMapSubject = new Subject<boolean>();

  private mapLocks:{[key:string]:boolean}={};
  constructor() {}

  lockMap(lockName)
  {
    //true means locked
    this.mapLocks[lockName] = true;
    this.lockMapSubject.next(this.isMapLocked());
  }
  unlockMap(lockName:string)
  {
    //false means unlocked
    this.mapLocks[lockName] = false;
    this.lockMapSubject.next(this.isMapLocked());
  }
  isMapLocked():boolean
  {
    return Object.keys(this.mapLocks).some(lockName => this.mapLocks[lockName]);
  }
  onMapLockChanged()
  {
    return this.lockMapSubject.asObservable();
  }
}
