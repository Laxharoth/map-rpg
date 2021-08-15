import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LockMapService {

  private lockMapSubject = new Subject<{lockname:string,value:boolean}>();

  private mapLocks:{[key:string]:boolean}={};
  constructor() {
    this.onMapLockChanged().subscribe((data) => {
      const lockname = data["lockname"];
      const value    = data["value"];
      this.mapLocks[lockname] = value;
    })

  }

  lockMap(lockName)
  {
    //true means locked
    this.lockMapSubject.next({lockname:lockName,value:true});
  }

  unlockMap(lockName:string)
  {
    //false means unlocked
    this.lockMapSubject.next({lockname:lockName,value:false});
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
