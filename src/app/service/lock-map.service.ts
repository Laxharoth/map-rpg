import { Subject } from 'rxjs';

/**
 * Service to prevent the player from moving in the map.
 *
 * @export
 * @class LockMapService
 */
export class LockMapService {

  /**
   * A 'list' of locks.
   *
   * @private
   * @memberof LockMapService
   */
  private lockMapSubject = new Subject<boolean>();

  private mapLocks:{[key:string]:boolean}={};
  constructor() {}

  /**
   * Adds a lock to the map if does not already exist.
   *
   * @param {string} lockName The name of the lock.
   * @memberof LockMapService
   */
  lockMap(lockName:string)
  {
    //true means locked
    this.mapLocks[lockName] = true;
    this.lockMapSubject.next(this.isMapLocked());
  }
  /**
   * Removes a lock from the map if exists.
   *
   * @param {string} lockName The name of the lock.
   * @memberof LockMapService
   */
  unlockMap(lockName:string)
  {
    //false means unlocked
    this.mapLocks[lockName] = false;
    this.lockMapSubject.next(this.isMapLocked());
  }
  /**
   * Checks if the map has any lock.
   *
   * @return {*}  {boolean}
   * @memberof LockMapService
   */
  isMapLocked():boolean
  {
    return Object.keys(this.mapLocks).some(lockName => this.mapLocks[lockName]);
  }
  /**
   * Returns a observable of any time a lock is added or removed.
   *
   * @return {*}
   * @memberof LockMapService
   */
  onMapLockChanged()
  {
    return this.lockMapSubject.asObservable();
  }
}
