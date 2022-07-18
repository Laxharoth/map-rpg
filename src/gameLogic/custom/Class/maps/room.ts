import { MasterService } from "src/app/service/master.service";
import { Scene } from "../Scene/Scene";

/** A model of a specific room
 * * Room functions order:
 * * onEnter
 * * beforeMoveTo
 * * onExit
 * * afterMoveTo
 */
export interface Room{
  /** The action to be performed when the room is entered. */
  onEnter     : () => void;
  /** The action to be performed when the room is exited. */
  onExit      : () => void;
  /** Perform an action before moving to a room. */
  beforeMoveTo ?: (roomName:string) => boolean;
  /** Perform an action after moving to a room. */
  afterMoveTo ?: (roomName:string) => void;
  icon        ?: string;
  updateable_scene?:{[key: string]:Scene};
}

export interface RoomFunction{
  create:(masterService:MasterService) => Room,
  roomname:string
  disabled?:(masterService:MasterService)=>boolean,
};
export function fillRoom(room:Room):Room{
  if(!room.beforeMoveTo) room.beforeMoveTo = ()=>true;
  if(!room.afterMoveTo) room.afterMoveTo = ()=>undefined;
  if(!room.icon) room.icon = '';
  return room;
}
