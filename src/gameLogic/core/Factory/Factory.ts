import { randomCheck, pushBattleActionOutput, randomBetween } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { FactoryFunction, factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { enterRoomOption, nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { primitive } from '../types';

/** @type {FactoryFunction&global_functions} */
export function Factory(masterService:MasterService,options:StoreableType)
{ return factoryMap[options.Factory](masterService,options) }
Factory.randomCheck=randomCheck;
Factory.randomBetween=randomBetween;
Factory.pushBattleActionOutput=pushBattleActionOutput;
enum options_names_enum {
  nextOption="nextOption",
  enterRoomOption="enterRoomOption",
}
Factory.options = {
  nextOption,
  enterRoomOption,
};
export type StoreableType = {Factory:factoryname,type: string,dependency_gamesave_object_key?:gamesavenames[],[key: string]:any};
export interface storeable {
  type:primitive,
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}
interface global_functions{
  randomCheck:typeof randomCheck;
  randomBetween:typeof randomBetween;
  pushBattleActionOutput:typeof pushBattleActionOutput;
  options:{[key in options_names_enum]:(masterService:MasterService,...args:any[])=>SceneOptions};
}
