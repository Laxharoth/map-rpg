import { MasterService } from "src/app/service/master.service";
import { factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { primitive } from '../types';

export function Factory(masterService:MasterService,options:StoreableType)
{ return factoryMap[options.Factory](masterService,options) }

export type StoreableType = {Factory:factoryname,
  type: string,dependencyGamesaveObjectKey?:gamesavenames[],[key: string]:any};
export interface Storeable {
  type:primitive,
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}
