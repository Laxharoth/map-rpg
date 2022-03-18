import { MasterService } from "src/app/service/master.service";
import { Scene } from "../Scene/Scene";

/** A model of a specific room */
export interface Room{
  /**
   * The action to be performed when the room is entered.
   * * Room functions order:
   *   * onEnter
   *   * beforeMoveTo
   *   * onExit
   *   * afterMoveTo
   */
     onEnter     : () => void;
     /**
      * The action to be performed when the room is exited.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      */
     onExit      : () => void;
     /**
      * Perform an action before moving to a room.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      */
     beforeMoveTo ?: (roomName:string) => boolean;
     /**
      * Perform an action after moving to a room.
      * * Room functions order:
      *   * onEnter
      *   * beforeMoveTo
      *   * onExit
      *   * afterMoveTo
      */
     afterMoveTo ?: (roomName:string) => void;
     icon        ?: string;
     updateable_scene?:{[key: string]:Scene};
}

export interface roomFunction{
  create:(masterService:MasterService) => Room,
  roomname:string
  disabled?:(masterService:MasterService)=>boolean,
};
export function fill_room(room:Room):Room
{
  const {beforeMoveTo=null,afterMoveTo=null,icon=null} = room;
  !beforeMoveTo && (room.beforeMoveTo = (roomName:string)=>true);
  !afterMoveTo && (room.afterMoveTo = (roomName:string)=>{});
  !icon && (room.icon = '');
  return room;
}
