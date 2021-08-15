import { Subject } from "rxjs";
import { Room } from "./room";
import { mapcolection } from "src/app/maps/mapcolection";
import { roomcolection } from './../../rooms/roomcolection';
import { FlagHandlerService } from "src/app/service/flag-handler.service";
import { DescriptionHandlerService } from "src/app/service/description-handler.service";
import { MapHandlerService } from "src/app/service/map-handler.service";

export class Map{
  roomsNames:string[][];
  private rooms:Array<(roomName:string,flagshandler: FlagHandlerService, descriptionhandler: DescriptionHandlerService, maphandler: MapHandlerService) => Room>[];

  loadRoomSubject:Subject<string>;

  mapcolection  = mapcolection;
  roomcolection = roomcolection;

  //Only to be passed to the room function when imports a specific room
  flagshandler:FlagHandlerService;
  descriptionhandler:DescriptionHandlerService;
  maphandler:MapHandlerService;

  constructor(flagshandler:FlagHandlerService
              ,descriptionhandler:DescriptionHandlerService
              ,maphandler:MapHandlerService)
  {
    this.flagshandler = flagshandler;
    this.descriptionhandler = descriptionhandler;
    this.maphandler = maphandler;
  }

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

  findRoomByName(roomName:string):{room:Room,coordinates:number[]} | null
  {
    for(let i = 0; i < this.roomsNames.length; i++)
    {
      for(let j = 0; j < this.roomsNames[i].length;j++)
      {
        if(roomName===this.roomsNames[i][j])
        {
          if(this.rooms[i][j])return {room:this.rooms[i][j](roomName,this.flagshandler,this.descriptionhandler,this.maphandler)
                                      ,coordinates:[i,j]};
          else return null;
        }
      }
    }
    return null;
  }

  findRoomByCoordinates(y:number, x:number):{room:Room,roomName:string}
  {
    const roomName = this.roomsNames[y]?.[x];
    return {room:this.rooms[y]?.[x]?.(roomName,this.flagshandler,this.descriptionhandler, this.maphandler)
            ,roomName:roomName};
  }
}
