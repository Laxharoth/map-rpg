import { Subject } from "rxjs";
import { mapcolection } from "src/app/maps/mapcolection";
import { roomcolection } from './../../rooms/roomcolection';
import { roomFunction } from "src/app/customTypes/customTypes";

/**
 * A model that represents a map
 *
 * @export
 * @class Map
 */
export class Map{
  /**
   * The matrix of the map that contains the names
   *
   * @type {string[][]}
   * @memberof Map
   */
  roomsNames:string[][];
  /**
   * The matrix of the map that contains the functions to create the rooms.
   *
   * @private
   * @type {roomFunction[][]}
   * @memberof Map
   */
  private rooms:roomFunction[][];

  mapcolection  = mapcolection;
  roomcolection = roomcolection;

  constructor() { }

  /**
   * Loads in the roomNames the matrix of the current map.
   *
   * @param {string} mapname The name of the map to load.
   * @memberof Map
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

  findRoomByName(roomName:string):{room:roomFunction,coordinates:number[]} | null
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
    return {room:this.rooms[y]?.[x]
            ,roomName:roomName};
  }
}
