import { MasterService } from "src/app/service/master.service";
import { factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { primitive } from '../types';

export function Factory(masterService:MasterService,options:StoreableType)
{ return factoryMap[options.Factory](masterService,options) }

export type StoreableType = {Factory:factoryname,type: string,dependency_gamesave_object_key?:gamesavenames[],[key: string]:any};
export interface storeable {
  type:primitive,
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}
