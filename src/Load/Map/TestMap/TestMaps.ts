import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { room as room1 } from "src/Load/Map/TestMap/map1/room1"
import { room as room7 } from "src/Load/Map/TestMap/map1/room7"
import { room25 } from "src/Load/Map/TestMap/map2/room25"
import { map as map1 } from "src/Load/Map/TestMap/map1"
import { map as map2 } from "src/Load/Map/TestMap/map2"


const register: registerFunction = ({rooms,maps}, {}, _ ) => {
  //map 1
  maps["map1"]=map1 as string[][];
  rooms["room1"]={map:"map1",room:room1('room1')}
  rooms["room2"]={map:"map1",room:room1('room2')}
  rooms["room3"]={map:"map1",room:room1('room3')}
  rooms["room4"]={map:"map1",room:room1('room4')}
  rooms["room5"]={map:"map1",room:room1('room5')}
  rooms["room6"]={map:"map1",room:room1('room6')}
  rooms["room7"]={map:"map1",room:room7}
  rooms["room8"]={map:"map1",room:room1('room8')}
  rooms["room9"]={map:"map1",room:room1('room9')}
  rooms["room10"]={map:"map1",room:room1('room10')}
  rooms["room11"]={map:"map1",room:room1('room11')}
  rooms["room12"]={map:"map1",room:room1('room12')}
  rooms["room13"]={map:"map1",room:room1('room13')}
  rooms["room14"]={map:"map1",room:room1('room14')}
  rooms["room15"]={map:"map1",room:room1('room15')}
  rooms["room16"]={map:"map1",room:room1('room16')}
  rooms["room17"]={map:"map1",room:room1('room17')}
  rooms["room18"]={map:"map1",room:room1('room18')}
  rooms["room19"]={map:"map1",room:room1('room19')}
  rooms["room20"]={map:"map1",room:room1('room20')}
  rooms["room21"]={map:"map1",room:room1('room21')}
  rooms["room22"]={map:"map1",room:room1('room22')}
  rooms["room23"]={map:"map1",room:room1('room23')}
  rooms["room24"]={map:"map1",room:room1('room24')}
  //map 2
  maps["map2"] = map2 as string[][];
  rooms["room25"]={map:"map2",room:room25('room25')}
  rooms["room26"]={map:"map2",room:room25('room26')}
  rooms["room27"]={map:"map2",room:room25('room27')}
  rooms["room28"]={map:"map2",room:room25('room28')}
  rooms["room29"]={map:"map2",room:room25('room29')}
  rooms["room30"]={map:"map2",room:room25('room30')}
  rooms["room31"]={map:"map2",room:room25('room31')}
  rooms["room32"]={map:"map2",room:room25('room32')}
  rooms["room33"]={map:"map2",room:room25('room33')}
  rooms["room34"]={map:"map2",room:room25('room34')}
  rooms["room35"]={map:"map2",room:room25('room35')}
  rooms["room36"]={map:"map2",room:room25('room36')}
  rooms["room37"]={map:"map2",room:room25('room37')}
  rooms["room38"]={map:"map2",room:room25('room38')}
  rooms["room39"]={map:"map2",room:room25('room39')}
  rooms["room40"]={map:"map2",room:room25('room40')}
  rooms["room41"]={map:"map2",room:room25('room41')}
  rooms["room42"]={map:"map2",room:room25('room42')}
  rooms["room43"]={map:"map2",room:room25('room43')}
  rooms["room44"]={map:"map2",room:room25('room44')}
  rooms["room45"]={map:"map2",room:room25('room45')}
  rooms["room46"]={map:"map2",room:room25('room46')}
  rooms["room47"]={map:"map2",room:room25('room47')}
  rooms["room48"]={map:"map2",room:room25('room48')}
}
const moduleName = "TestMap";
const moduleDependency:string[] = [];
export { register, moduleName, moduleDependency};
