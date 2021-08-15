import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Room } from '../classes/maps/room';
import { Map } from '../classes/maps/map';
import { DescriptionHandlerService } from './description-handler.service';
import { FlagHandlerService } from './flag-handler.service';
import { LockMapService } from './lock-map.service';

@Injectable({
  providedIn: 'root'
})
/**
 //TODO Implement a way to disable move to other room
 //TODO make the move to other room a single method
 */
export class MapHandlerService {

  private loadMapSubject = new Subject<Map>();
  private coordinatesSubject = new Subject<number[]>();

  currentMapName:string ="";
  currentRoomName:string="";
  coordinates:Array<number> = [];

  private flagshandler: FlagHandlerService;
  private descriptionhandler:DescriptionHandlerService;
  private lockmap: LockMapService;

  private currentRoom:Room = new Room({onEnter:_=>{},onExit:_=>{},icon:''});
  currentMap:Map;

  constructor(flagshandler: FlagHandlerService,
    descriptionhandler:DescriptionHandlerService,
    lockmap:LockMapService
    )
  {
      this.flagshandler = flagshandler;
      this.descriptionhandler = descriptionhandler;
      this.lockmap = lockmap;

    this.currentMap = new Map(this.flagshandler,this.descriptionhandler,this)
  }

  loadMap(mapName: string):void {
    if(!this.currentMap.mapcolection[mapName])
    {
      console.log("map does not exist");
      return;
    }

    this.currentMap.loadMap(mapName);
    this.loadMapSubject.next(this.currentMap);
  }

  loadRoom(roomName: string)
  {
    const {map:mapname=null,room=null} = this.currentMap.roomcolection[roomName];
    if(!room)
    {
      console.log("room does not exist");
      return;
    }

    if(this.currentRoom.beforeMoveTo(roomName))
    {
      this.currentRoomName = roomName;

      if(mapname !== this.currentMapName)
      {
        this.currentMapName = mapname;
        this.loadMap(mapname);
      }
      //check if room is loaded if not wait for the subscription
      this.loadRoomHelper(roomName);
    }
  }

  moveInsideMap(DIRECTION:string)
  {
    let [y,x] = this.coordinates;
    switch (DIRECTION)
    {
      case "UP"   :y--;break;
      case "DOWN" :y++;break;
      case "LEFT" :x--;break;
      case "RIGHT":x++;break;
      default:return;
    }
    this.loadRoomHelper([y,x]);
  }

  onLoadMap()
  {
    return this.loadMapSubject.asObservable();
  }
  onCoordinatesChanged()
  {
    return this.coordinatesSubject.asObservable();
  }

  private loadRoomHelper(roomnameORcoordinates: string|number[]):boolean
  {
    if(this.lockmap.isMapLocked())return false;
    let shouldChangeRoom = false;
    let foundRoom:Room;
    let coordinates:number[];
    let roomName:string;
    if(typeof(roomnameORcoordinates)==="string")
    {
      roomName = roomnameORcoordinates;
      this.flagshandler.setFlag('currentroom',roomName);
      ({room:foundRoom,coordinates} = this.currentMap.findRoomByName(roomName))
      if(foundRoom && this.currentRoom !== foundRoom && this.currentRoom.beforeMoveTo(roomName))
        shouldChangeRoom = true;
    }
    else
    {
      coordinates = roomnameORcoordinates;
      const [y,x] = coordinates;
      ({room:foundRoom,roomName} = this.currentMap.findRoomByCoordinates(y,x))
      if(roomName && this.currentRoom.beforeMoveTo(roomName))
      {
        this.currentRoomName = roomName;
        if(foundRoom && this.currentRoom !==foundRoom)
          shouldChangeRoom = true;
      }
    }
    if(shouldChangeRoom)
    {
      this.flagshandler.setFlag("currentroom",roomName);
      this.currentRoom.onExit();
      this.currentRoom=foundRoom;
      this.currentRoom.onEnter();
      this.coordinates = coordinates;
      this.coordinatesSubject.next(this.coordinates);
      return true;
    }
    return false;
  }

}
