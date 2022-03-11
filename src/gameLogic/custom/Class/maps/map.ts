import { roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { mapcollection } from "src/gameLogic/custom/MapCollection/maps/mapcollection";
import { roomcollection } from "src/gameLogic/custom/MapCollection/rooms/roomcollection";

/**
 * A model that represents a map
 *
 * @export
 * @class GameMap
 */
export class GameMap{
  /**
   * The matrix of the map that contains the names
   *
   * @type {string[][]}
   * @memberof GameMap
   */
  roomsNames:string[][];
  /**
   * The matrix of the map that contains the functions to create the rooms.
   *
   * @private
   * @type {roomFunction[][]}
   * @memberof GameMap
   */
  private rooms:roomFunction[][];

  mapcolection  = mapcollection;
  roomcolection = roomcollection;

  /**
   * Loads in the roomNames the matrix of the current map.
   *
   * @param {string} mapname The name of the map to load.
   * @memberof GameMap
   */
  loadMap(mapname:string):void{
    this.roomsNames = this.mapcolection[mapname];
    Object.freeze(this.roomsNames);
    this.rooms = [];
    for(let i = 0; i < this.roomsNames.length; i++)
    {
      this.rooms[i] = [];
      for(let j = 0; j < this.roomsNames[i].length;j++)
      {
        if(this.roomsNames[i][j])
        {
          this.rooms[i][j] = this.roomcolection[this.roomsNames[i][j]].room;
        }
      }
    }
  }

  findRoomByName(roomName:string):{room:roomFunction,coordinates:[number,number]} | null
  {
    for(let i = 0; i < this.roomsNames.length; i++)
    {
      for(let j = 0; j < this.roomsNames[i].length;j++)
      {
        if(roomName===this.roomsNames[i][j])
        {
          if(this.rooms[i][j])return {room:this.rooms[i][j]
                                      ,coordinates:[i,j]};
          else return null;
        }
      }
    }
    return null;
  }

  findRoomByCoordinates(y:number, x:number):{room:roomFunction,roomName:string}
  {
    const roomName = this.roomsNames[y]?.[x];
    const room = this.rooms[y]?.[x];
    return {room:room,
            roomName:roomName};
  }
}
