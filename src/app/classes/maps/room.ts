export class Room{
  onEnter     : () => void;
  onExit      : () => void;
  beforeMoveTo: (roomName:string) => boolean;
  icon        : string;
  constructor({onEnter,onExit,beforeMoveTo=(roomName:string) => true,icon}) {
    this.onEnter       = onEnter;
    this.onExit        = onExit;
    this.beforeMoveTo  = beforeMoveTo;
    this.icon          = icon;
  }
}
