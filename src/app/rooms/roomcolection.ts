import { Room } from "../classes/maps/room"
import { FlagHandlerService } from "../service/flag-handler.service"
import { DescriptionHandlerService } from "../service/description-handler.service"
import { MapHandlerService } from "../service/map-handler.service"
import {room as room1} from "./room1"
import {room as room2} from "./room1"
import {room as room3} from "./room1"
import {room as room4} from "./room1"
import {room as room5} from "./room1"
import {room as room6} from "./room1"
import {room as room7} from "./room7"
import {room as room8} from "./room1"
import {room as room9} from "./room1"
import {room as room10} from "./room1"
import {room as room11} from "./room1"
import {room as room12} from "./room1"
import {room as room13} from "./room1"
import {room as room14} from "./room1"
import {room as room15} from "./room1"
import {room as room16} from "./room1"
import {room as room17} from "./room1"
import {room as room18} from "./room1"
import {room as room19} from "./room1"
import {room as room20} from "./room1"
import {room as room21} from "./room1"
import {room as room22} from "./room1"
import {room as room23} from "./room1"
import {room as room24} from "./room1"


export const roomcolection:{[key: string]: {map:string,room:(flagshandler: FlagHandlerService, descriptionhandler: DescriptionHandlerService, maphandler: MapHandlerService) => Room}} = {
  //map1
  room1:{map:"map1",room:room1('room1')},
  room2:{map:"map1",room:room1('room2')},
  room3:{map:"map1",room:room1('room3')},
  room4:{map:"map1",room:room1('room4')},
  room5:{map:"map1",room:room1('room5')},
  room6:{map:"map1",room:room1('room6')},
  room7:{map:"map1",room:room7},
  room8:{map:"map1",room:room1('room8')},
  room9:{map:"map1",room:room1('room9')},
  room10:{map:"map1",room:room1('room10')},
  room11:{map:"map1",room:room1('room11')},
  room12:{map:"map1",room:room1('room12')},
  room13:{map:"map1",room:room1('room13')},
  room14:{map:"map1",room:room1('room14')},
  room15:{map:"map1",room:room1('room15')},
  room16:{map:"map1",room:room1('room16')},
  room17:{map:"map1",room:room1('room17')},
  room18:{map:"map1",room:room1('room18')},
  room19:{map:"map1",room:room1('room19')},
  room20:{map:"map1",room:room1('room20')},
  room21:{map:"map1",room:room1('room21')},
  room22:{map:"map1",room:room1('room22')},
  room23:{map:"map1",room:room1('room23')},
  room24:{map:"map1",room:room1('room24')}
}
