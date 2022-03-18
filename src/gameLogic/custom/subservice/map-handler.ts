import { roomcollection } from 'src/gameLogic/custom/MapCollection/roomcollection';
import { Observable, Subject, Subscription } from 'rxjs';

import { MasterService } from "src/app/service/master.service";
import { GameStateService } from '../../core/subservice/game-state';
import { GameMap } from 'src/gameLogic/custom/Class/maps/map';
import { fill_room, Room, roomFunction } from 'src/gameLogic/custom/Class/maps/room';
import { LockMapService } from './lock-map';
import { mapcollection } from '../MapCollection/mapcollection';

/** A service that allows the player to move in the map. */
export class MapHandlerService {
  private loadMapSubject = new Subject<GameMap>();
  private coordinatesSubject = new Subject<number[]>();

  currentMapName:string ="";
  coordinates:Array<number> = [];

  private readonly masterService: MasterService;
  private gameStateSubscription: Subscription;

  private currentRoom:Room = fill_room({onEnter:()=>{},onExit:()=>{},icon:''});
  currentMap:GameMap;

  constructor(masterService:MasterService,gameStateHandler:GameStateService, private lockmap:LockMapService){
    this.masterService = masterService;
    this.currentMap = new GameMap()
    this.gameStateSubscription = gameStateHandler.onSetGameState().subscribe(gameState=>{
      lockmap.lockMap('game-state-lock');
      if(gameState === 'map') lockmap.unlockMap('game-state-lock');
    })
  }

  /** Loads the map functions */
  loadMap(mapName: string):void {
    if(!mapcollection[mapName])
    {
      console.error("map does not exist");
      return;
    }
    this.currentMap.loadMap(mapName);
    this.loadMapSubject.next(this.currentMap);
  }

  /** Loads a room by name. */
  loadRoom(roomName: string):void{
    const {map:mapname=null} = roomcollection[roomName];
    if(mapname && mapname !== this.currentMapName){
      this.currentMapName = mapname;
      this.loadMap(mapname);
    }
    const { room=null,coordinates=[0,0] } = this.currentMap.findRoomByName(roomName)||{};
    if(!room){
      console.error("room does not exist");
      return;
    }
    if(!this.currentRoom.beforeMoveTo?.(roomName)){ return; }

    this.loadRoomHelper(room,coordinates);
  }

  /** Loads a room by position in the current map matrix. */
  moveInsideMap(direction:direction):void{
    if(this.lockmap.isMapLocked())return;
    let [y,x] = this.coordinates;
    switch (direction){
      case "UP"   :y--;break;
      case "DOWN" :y++;break;
      case "LEFT" :x--;break;
      case "RIGHT":x++;break;
      default:return;
    }
    const room = this.currentMap.findRoomByCoordinates(y,x)
    if(!room)return;//out of map border
    if(!this.currentRoom.beforeMoveTo?.(room.roomname))return;
    this.loadRoomHelper(room,[y,x]);
  }
  /** Returns an observable for when the map changes. */
  onLoadMap():Observable<GameMap>{
    return this.loadMapSubject.asObservable();
  }
  /** Returns an observable for when the room changes. */
  onCoordinatesChanged():Observable<number[]>{
    return this.coordinatesSubject.asObservable();
  }
  /** Loads a room given a name or coordinates. */
  private loadRoomHelper(room:roomFunction,coordinates:[number,number]):boolean{
    if(room.disabled&&room.disabled(this.masterService)){ return false; }
    const foundRoom = fill_room(room?.create(this.masterService));
    this.masterService.flagsHandler.setFlag('currentroom',room.roomname);
    this.currentRoom.onExit();
    foundRoom.onEnter();
    this.currentRoom.afterMoveTo?.(room.roomname);
    this.currentRoom=foundRoom;
    this.coordinates = coordinates;
    this.coordinatesSubject.next(this.coordinates);
    return true;
  }
}
export type direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
