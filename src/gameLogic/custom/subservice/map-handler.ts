import { Observable, Subject, Subscription } from 'rxjs';

import { MasterService } from "src/app/service/master.service";
import { GameStateService } from '../../core/subservice/game-state';
import { GameMap } from 'src/gameLogic/custom/Class/maps/map';
import { fill_room, Room, roomFunction } from 'src/gameLogic/custom/Class/maps/room';
import { LockMapService } from './lock-map';

/**
 * A service that allows the player to move in the map.
 *
 * @export
 * @class MapHandlerService
 */
export class MapHandlerService {

  private loadMapSubject = new Subject<GameMap>();
  private coordinatesSubject = new Subject<number[]>();

  currentMapName:string ="";
  coordinates:Array<number> = [];

  private readonly masterService: MasterService;
  private gameStateSubscription: Subscription;

  private currentRoom:Room = fill_room({onEnter:()=>{},onExit:()=>{},icon:''});
  currentMap:GameMap;

  constructor(masterService:MasterService,gameStateHandler:GameStateService, private lockmap:LockMapService)
  {
    this.masterService = masterService;
    this.currentMap = new GameMap()
    this.gameStateSubscription = gameStateHandler.onSetGameState().subscribe(gameState=>{
      lockmap.lockMap('game-state-lock');
      if(gameState === 'map') lockmap.unlockMap('game-state-lock');
    })
  }

  /**
   * Loads the map functions
   *
   * @param {string} mapName
   * @return { void }
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
    const {map:mapname=null} = this.currentMap.roomcolection[roomName];
    if(mapname !== this.currentMapName)
    {
      this.currentMapName = mapname;
      this.loadMap(mapname);
    }
    const { room,coordinates } = this.currentMap.findRoomByName(roomName);
    if(!room){
      console.error("room does not exist");
      return;
    }
    if(!this.currentRoom.beforeMoveTo(roomName))return;

    this.loadRoomHelper(room,roomName,coordinates);
  }

  /**
   * Loads a room by position in the current map matrix.
   *
   * @param {string} DIRECTION
   * @return {*}
   * @memberof MapHandlerService
   */
  moveInsideMap(DIRECTION:direction):void
  {
    if(this.lockmap.isMapLocked())return;
    let [y,x] = this.coordinates;
    switch (DIRECTION)
    {
      case "UP"   :y--;break;
      case "DOWN" :y++;break;
      case "LEFT" :x--;break;
      case "RIGHT":x++;break;
      default:return;
    }
    const {roomName=null,room=null} = this.currentMap.findRoomByCoordinates(y,x)
    if(!roomName)return;//out of map border
    if(!this.currentRoom.beforeMoveTo(roomName))return;
    this.loadRoomHelper(room,roomName,[y,x]);
  }

  /**
   * Returns an observable for when the map changes.
   *
   * @return {*}
   * @memberof MapHandlerService
   */
  onLoadMap():Observable<GameMap>
  {
    return this.loadMapSubject.asObservable();
  }
  /**
   * Returns an observable for when the room changes.
   *
   * @return { Observable<number[]> }
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
   * @param {(string|number[])} roomName The room name or coordinates.
   * @return { boolean } if the room changes.
   * @memberof MapHandlerService
   */
  private loadRoomHelper(room:roomFunction,roomName: string,coordinates:[number,number]):boolean
  {
    const foundRoom = fill_room(room?.(this.masterService));
    this.masterService.flagsHandler.setFlag('currentroom',roomName);
    this.currentRoom.onExit();
    foundRoom.onEnter();
    this.currentRoom.afterMoveTo(roomName);
    this.currentRoom=foundRoom;
    this.coordinates = coordinates;
    this.coordinatesSubject.next(this.coordinates);
    return true;
  }

}

export type direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
