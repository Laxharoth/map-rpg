import { MasterService } from "src/app/service/master.service";

/**
 * A model of a specific room
 *
 * @export
 * @class Room
 */
export class Room{
  constructor({onEnter,onExit,beforeMoveTo=(roomName:string) => true,afterMoveTo=(roomName:string)=>{},icon}) {
    this.onEnter       = onEnter;
    this.onExit        = onExit;
    this.beforeMoveTo  = beforeMoveTo;
    this.afterMoveTo   = afterMoveTo;
    this.icon          = icon;
  }
    /**
   * The action to be performed when the room is entered.
   * * Room functions order:
   *  * onEnter
   *  * beforeMoveTo
   *  * onExit
   *  * afterMoveTo
   *
   * @memberof Room
   */
     onEnter     : () => void;
     /**
      * The action to be performed when the room is exited.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      *
      * @memberof Room
      */
     onExit      : () => void;
     /**
      * Perform an action before moving to a room.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      *
      * @param {string} roomName The name of the room to be moved.
      * @returns true if can move to the specified room.
      * @memberof Room
      */
     beforeMoveTo: (roomName:string) => boolean;
     /**
      * Perform an action after moving to a room.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      *
      * @param {string} roomName The name of the room to be moved.
      * @memberof Room
      */
     afterMoveTo: (roomName:string) => void;
     icon        : string;
}

export type roomFunction = (masterService:MasterService) => Room;
