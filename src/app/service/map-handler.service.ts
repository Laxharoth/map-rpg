import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Room } from '../classes/maps/room';
import { Map } from '../classes/maps/map';
import { roomFunction } from '../customTypes/customTypes';
import { MasterService } from '../classes/masterService';

/**
 * A service that allows the player to move in the map.
 *
 * @export
 * @class MapHandlerService
 */
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

  private readonly masterService: MasterService;
  private gameStateSubscription: Subscription;

  private currentRoom:Room = new Room({onEnter:_=>{},onExit:_=>{},icon:''});
  currentMap:Map;

  constructor(masterService:MasterService)
  {
    this.masterService = masterService;
    this.currentMap = new Map()
    this.gameStateSubscription = masterService.gameStateHandler.onSetGameState().subscribe(gameState=>{
      masterService.lockmap.lockMap('game-state-lock');
      if(gameState === 'map') masterService.lockmap.unlockMap('game-state-lock');
    })
  }

  /**
   * Loads the map functions
   *
   * @param {string} mapName
   * @return {*}  {void}
   * @memberof MapHandlerService
   */
  loadMap(mapName: string):void {
    if(!this.currentMap.mapcolection[mapName])
    {
      console.error("map does not exist");
      return;
    }
    this.currentMap.loadMap(mapName);
    this.loadMapSubject.next(this.currentMap);
  }

  /**
   * Loads a room by name.
   *
   * @param {string} roomName Name of the room.
   * @return {*}
   * @memberof MapHandlerService
   */
  loadRoom(roomName: string):void
  {
    const {map:mapname=null,room=null} = this.currentMap.roomcolection[roomName];
    if(!room)
    {
      console.error("room does not exist");
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

  /**
   * Loads a room by position in the current map matrix.
   *
   * @param {string} DIRECTION
   * @return {*}
   * @memberof MapHandlerService
   */
  moveInsideMap(DIRECTION:string):void
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

  /**
   * Returns an observable for when the map changes.
   *
   * @return {*}
   * @memberof MapHandlerService
   */
  onLoadMap():Observable<Map>
  {
    return this.loadMapSubject.asObservable();
  }
  /**
   * Returns an observable for when the room changes.
   *
   * @return {*}  {Observable<number[]>}
   * @memberof MapHandlerService
   */
  onCoordinatesChanged():Observable<number[]>
  {
    return this.coordinatesSubject.asObservable();
  }

  /**
   * Loads a room given a name or coordinates.
   *
   * @private
   * @param {(string|number[])} roomnameORcoordinates The room name or coordinates.
   * @return {*}  {boolean} if the room changes.
   * @memberof MapHandlerService
   */
  private loadRoomHelper(roomnameORcoordinates: string|number[]):boolean
  {
    if(this.masterService.lockmap.isMapLocked())return false;
    let shouldChangeRoom = false;
    let foundRoom:Room;
    let room:roomFunction;
    let coordinates:number[];
    let roomName:string;
    if(typeof(roomnameORcoordinates)==="string")
    {
      roomName = roomnameORcoordinates;
      this.masterService.flagsHandler.setFlag('currentroom',roomName);
      ({room,coordinates} = this.currentMap.findRoomByName(roomName))
      foundRoom = room?.(this.masterService);
      if(foundRoom && this.currentRoom !== foundRoom && this.currentRoom.beforeMoveTo(roomName))
        shouldChangeRoom = true;
    }
    else
    {
      coordinates = roomnameORcoordinates;
      const [y,x] = coordinates;
      ({room,roomName} = this.currentMap.findRoomByCoordinates(y,x))
      foundRoom = room?.(this.masterService)
      if(roomName && this.currentRoom.beforeMoveTo(roomName))
      {
        this.currentRoomName = roomName;
        if(foundRoom && this.currentRoom !==foundRoom)
          shouldChangeRoom = true;
      }
    }
    if(shouldChangeRoom)
    {
      this.masterService.flagsHandler.setFlag("currentroom",roomName);
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
