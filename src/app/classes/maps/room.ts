/**
 * A model of a specific room
 *
 * @export
 * @class Room
 */
export class Room{
  /**
   * The action to be performed when the room is entered.
   *
   * @memberof Room
   */
  onEnter     : () => void;
  /**
   * The action to be performed when the room is exit.
   *
   * @memberof Room
   */
  onExit      : () => void;
  /**
   * Perform an action before moving to a room.
   *
   * @memberof Room
   */
  beforeMoveTo: (roomName:string) => boolean;
  icon        : string;
  constructor({onEnter,onExit,beforeMoveTo=(roomName:string) => true,icon}) {
    this.onEnter       = onEnter;
    this.onExit        = onExit;
    this.beforeMoveTo  = beforeMoveTo;
    this.icon          = icon;
  }
}
