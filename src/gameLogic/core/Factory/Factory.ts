import { MasterService } from "src/app/service/master.service";
import { factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";

export function Factory(masterService:MasterService,factoryName:factoryname,type:string,options:{[key: string]:any})
{ return factoryMap[factoryName](masterService,type,options) }

export type StoreableType = {Factory:factoryname,type: string,RequiredKey?:gamesavenames,[key: string]:any};
export interface storeable {
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}
