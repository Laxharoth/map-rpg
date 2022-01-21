import { randomCheck, pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { FactoryFunction, factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";
import { Description, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';
import { nextOption } from 'src/gameLogic/custom/Class/Descriptions/CommonOptions';

/** @type {FactoryFunction&global_functions} */
export function Factory(masterService:MasterService,options:StoreableType)
{ return factoryMap[options.Factory](masterService,options) }
Factory.randomCheck=randomCheck;
Factory.pushBattleActionOutput=pushBattleActionOutput;
Factory.Description = Description;
enum options_names_enum {
  nextOption="nextOption",
}
Factory.options = {
  nextOption:nextOption,
};
export type StoreableType = {Factory:factoryname,type: string,dependency_gamesave_object_key?:gamesavenames[],[key: string]:any};
export interface storeable {
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}
interface global_functions{
  randomCheck:typeof randomCheck;
  pushBattleActionOutput:typeof pushBattleActionOutput;
  Description:typeof Description;
  options:{[key in options_names_enum]:(masterService:MasterService,...args:any[])=>DescriptionOptions};
}
