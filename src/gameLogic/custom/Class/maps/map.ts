import { roomFunction } from "src/gameLogic/custom/Class/maps/room";
import { mapcollection } from "src/gameLogic/custom/MapCollection/mapcollection";
import { roomcollection } from "src/gameLogic/custom/MapCollection/roomcollection";

/** A model that represents a map */
export class GameMap{
  /** The matrix of the map that contains the functions to create the rooms. */
  rooms:roomFunction[][]=[];
  /** Loads in the roomNames the matrix of the current map. */
  loadMap(mapname:string):void{
    const roomsNames = mapcollection[mapname];
    this.rooms = [];
    for(let i = 0; i < roomsNames.length; i++){
      this.rooms[i] = [];
      for(let j = 0; j < roomsNames[i].length;j++){
        if(roomsNames[i][j]){
          this.rooms[i][j] = roomcollection[roomsNames[i][j]].room;
        }
      }
    }
  }

  findRoomByName(roomName:string):{room:roomFunction,coordinates:[number,number]} | null{
    for(let i = 0; i < this.rooms.length; i++){
      for(let j = 0; j < this.rooms[i].length;j++){
        if(this.rooms[i][j] && roomName===this.rooms[i][j].roomname){
          return {
            room:this.rooms[i][j],
            coordinates:[i,j]
          };
        }
      }
    }
    return null;
  }
  findRoomByCoordinates(y:number, x:number):roomFunction{
    const room = this.rooms[y]?.[x];
    return room;
  }
}
