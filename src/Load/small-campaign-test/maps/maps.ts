import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { map as barn } from "src/Load/small-campaign-test/maps/barn/map";
import { map as mansion } from "src/Load/small-campaign-test/maps/mansion/map";
import { map as street } from "src/Load/small-campaign-test/maps/street/map";
import { loft, secretExit, stairs, barn as fnBarn } from "./barn/barn";
import { entrace as fnentrance, stairs as mstairs, upper } from "./mansion/mansion"
import { street as fnstreet } from "./street/street";

const register:registerFunction = ({maps,rooms}, {}, Factory)=>{
  // @ts-ignore
  Factory.options.roomOptions = (masterService:MasterService)=>[
    {
      text:'save',
      action(){
        masterService.gameSaver.save("save2");
      },
      disabled:false
    },
    null,null,null,null
  ]
  {
    // tslint:disable: no-string-literal
    maps["barn"] = barn as string[][];
    rooms["loft"]        = {room:loft,map:"barn"}
    rooms["stairs"]      = {room:stairs,map:"barn"}
    rooms["secret_exit"] = {room:secretExit,map:"barn"}
    for(let i=0;i<9;i++){
      const roomname = `barn${i+1}`;
      rooms[roomname]= {room:fnBarn(roomname,Factory),map:"barn"}
    }
  }
  {
    maps["mansion"] = mansion as string[][];
    rooms["upper"]    = {room:upper(Factory),map:"mansion"}
    rooms["mstairs"]  = {room:mstairs(Factory),map:"mansion"}
    for(let i=0;i<9;i++){
      const roomname = `entrance${i+1}`;
      rooms[roomname]= {room:fnentrance(roomname,Factory),map:"mansion"}
    }
  }
  {
    maps["street"] = street as string[][];
    for(let i=0;i<9;i++){
      const roomname = `street${i+1}`;
      rooms[roomname] = {room:fnstreet(roomname,Factory),map:"street"};
    }
  }
}
const moduleName = "small-campaign-maps";
const moduleDependency:string[] = [
  "small-campaign-battle-class",
  "small-campaign-items",
  "small-campaign-quest",
  "small-campaign-reaction",
  "small-campaign-special-attack",
  "small-campaign-status",
];
export { register, moduleName, moduleDependency };
